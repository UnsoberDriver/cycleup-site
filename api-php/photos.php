<?php
/** Galerie photo des rosalies — GET liste, POST nouvelle photo (dataURL). */
declare(strict_types=1);
require __DIR__ . '/lib.php';

const PLACES = ['Tarbes', 'Pau', 'Toulouse', 'Lourdes', 'Autre lieu'];
const MAX_PHOTOS = 150;
const MAX_BYTES = 1600000; // ~1,6 Mo décodé par photo

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    json_out(['ok' => true, 'photos' => array_values(load_data('photos.json', []))]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

reject_if_banned();
rate_limit('photos', 45, 12);

$b = body_json();
$src = clean_text($b['src'] ?? '', 2200000);
$place = clean_text($b['place'] ?? '', 20);
$caption = clean_text($b['caption'] ?? '', 120);
$author = clean_text($b['author'] ?? '', 50);

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

$photo = [
    'id' => bin2hex(random_bytes(8)),
    'src' => $src,
    'place' => $place,
    'caption' => $caption,
    'author' => $author === '' ? 'Anonyme' : $author,
    'createdAt' => date('c'),
];

$photos[] = $photo;
if (!save_data('photos.json', $photos)) {
    json_out(['ok' => false, 'error' => 'Sauvegarde impossible, réessaie.'], 500);
}

json_out(['ok' => true, 'photo' => $photo]);
