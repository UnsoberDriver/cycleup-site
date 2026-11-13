<?php
/** Galerie photo des rosalies — GET liste, POST nouvelle photo (dataURL). */
declare(strict_types=1);
require __DIR__ . '/lib.php';

const PLACES = ['Tarbes', 'Pau', 'Toulouse', 'Lourdes', 'Autre lieu'];
const MAX_PHOTOS = 150;
const MAX_BYTES = 1600000; // ~1,6 Mo décodé par photo

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    // L'empreinte interne du secret d'auteur n'est jamais exposée publiquement.
    $public = array_map(static function (array $p): array {
        unset($p['owner']);
        return $p;
    }, array_values(load_data('photos.json', [])));
    json_out(['ok' => true, 'photos' => $public]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

reject_if_banned();
rate_limit('photos', 45, 12);

$b = body_json();

/* ---- Suppression par l'auteur de sa propre photo (sans mot de passe admin) ---- */
if (($b['action'] ?? '') === 'delete') {
    $id = clean_text($b['id'] ?? '', 40);
    $secret = clean_text($b['secret'] ?? '', 64);
    if ($id === '' || $secret === '') {
        json_out(['ok' => false, 'error' => 'Paramètres invalides.'], 422);
    }
    $all = load_data('photos.json', []);
    $kept = array_values(array_filter($all, fn ($e) => ($e['id'] ?? '') !== $id));
    if (count($kept) === count($all)) {
        json_out(['ok' => false, 'error' => 'Photo introuvable.'], 404);
    }
    $target = null;
    foreach ($all as $e) {
        if (($e['id'] ?? '') === $id) {
            $target = $e;
            break;
        }
    }
    $expected = (string) ($target['owner'] ?? '');
    if ($expected === '' || !hash_equals($expected, owner_hash($secret))) {
        json_out(['ok' => false, 'error' => 'Seul l’auteur de la photo peut la supprimer.'], 403);
    }
    if (!save_data('photos.json', $kept)) {
        json_out(['ok' => false, 'error' => 'Sauvegarde impossible.'], 500);
    }
    json_out(['ok' => true]);
}

$src = clean_text($b['src'] ?? '', 2200000);
$place = clean_text($b['place'] ?? '', 20);
$caption = clean_text($b['caption'] ?? '', 120);
$author = clean_text($b['author'] ?? '', 50);
$secret = clean_text($b['secret'] ?? '', 64);

if (!in_array($place, PLACES, true)) {
    json_out(['ok' => false, 'error' => 'Lieu inconnu.'], 422);
}
if (!preg_match('#^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$#', $src)) {
    json_out(['ok' => false, 'error' => 'Image invalide (JPG, PNG ou WebP attendus).'], 422);
}
$raw = base64_decode(substr($src, strpos($src, ',') + 1), true);
if ($raw === false || strlen($raw) > MAX_BYTES) {
    json_out(['ok' => false, 'error' => 'Image trop lourde après compression.'], 422);
}

$photos = load_data('photos.json', []);
if (count($photos) >= MAX_PHOTOS) {
    json_out(['ok' => false, 'error' => 'La galerie est complète ; une modération est nécessaire avant un nouvel envoi.'], 507);
}

// Modération du langage : légendes insultantes refusées.
reject_if_abusive([$caption, $author], 'photos');

$photo = [
    'id' => bin2hex(random_bytes(8)),
    'src' => $src,
    'place' => $place,
    'caption' => $caption,
    'author' => $author === '' ? 'Anonyme' : $author,
    'createdAt' => date('c'),
];
// Empreinte du secret d'auteur (jamais exposée publiquement).
if ($secret !== '') {
    $photo['owner'] = owner_hash($secret);
}

$photos[] = $photo;
if (!save_data('photos.json', $photos)) {
    json_out(['ok' => false, 'error' => 'Sauvegarde impossible, réessaie.'], 500);
}

json_out(['ok' => true, 'photo' => $photo]);
