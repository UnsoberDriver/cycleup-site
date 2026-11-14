<?php
/** Forum public — GET liste, POST nouveau message. */
declare(strict_types=1);
require __DIR__ . '/lib.php';

const TOPICS = ['general', 'projets', 'rosalies', 'idees', 'questions'];
const MAX_MESSAGES = 2000;

$messages = load_data('forum.json', []);
if ($messages === []) {
    // Amorçage : message de bienvenue (les suivants viennent du site).
    $messages = [
        [
            'id' => 'welcome-1',
            'topic' => 'general',
            'author' => 'Équipe éditoriale',
            'title' => 'Bienvenue sur le forum',
            'content' => "Cet espace est ouvert à toutes et tous. Vous pouvez participer en choisissant un thème, en proposant un sujet ou en réagissant aux publications existantes.",
            'createdAt' => date('c'),
        ],
    ];
    save_data('forum.json', $messages);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    // L'empreinte interne du secret d'auteur n'est jamais exposée publiquement.
    // Le marquage « banni » est en revanche public : les visiteurs voient les
    // messages signalés, affichés en rouge, plutôt que de les voir disparaître.
    $public = array_map(static function (array $m): array {
        unset($m['owner']);
        return $m;
    }, array_values($messages));
    json_out(['ok' => true, 'messages' => $public]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

reject_if_banned();
rate_limit('forum', 20, 10);

$b = body_json();

/* ---- Suppression par l'auteur de son propre message (sans mot de passe admin) ---- */
if (($b['action'] ?? '') === 'delete') {
    $id = clean_text($b['id'] ?? '', 40);
    $secret = clean_text($b['secret'] ?? '', 64);
    if ($id === '' || $secret === '') {
        json_out(['ok' => false, 'error' => 'Paramètres invalides.'], 422);
    }
    $all = load_data('forum.json', []);
    $kept = array_values(array_filter($all, fn ($e) => ($e['id'] ?? '') !== $id));
    if (count($kept) === count($all)) {
        json_out(['ok' => false, 'error' => 'Message introuvable.'], 404);
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
        json_out(['ok' => false, 'error' => 'Seul l’auteur du message peut le supprimer.'], 403);
    }
    if (!save_data('forum.json', $kept)) {
        json_out(['ok' => false, 'error' => 'Sauvegarde impossible.'], 500);
    }
    json_out(['ok' => true]);
}

$topic = clean_text($b['topic'] ?? '', 20);
$author = clean_text($b['author'] ?? '', 60);
$title = clean_text($b['title'] ?? '', 120);
$content = clean_text($b['content'] ?? '', 5000);
$secret = clean_text($b['secret'] ?? '', 64);

if (!in_array($topic, TOPICS, true)) {
    json_out(['ok' => false, 'error' => 'Thème inconnu.'], 422);
}
if ($author === '' || mb_strlen($author) < 2) {
    json_out(['ok' => false, 'error' => 'Indique un nom ou un pseudo (2 caractères minimum).'], 422);
}
if ($title === '' || mb_strlen($title) < 3) {
    json_out(['ok' => false, 'error' => 'Le titre doit contenir au moins 3 caractères.'], 422);
}
if ($content === '' || mb_strlen($content) < 5) {
    json_out(['ok' => false, 'error' => 'Le message doit contenir au moins 5 caractères.'], 422);
}

// Modération du langage : insultes et messages malveillants refusés à la publication.
reject_if_abusive([$title, $content, $author], 'forum');

$msg = [
    'id' => bin2hex(random_bytes(8)),
    'topic' => $topic,
    'author' => $author,
    'title' => $title,
    'content' => $content,
    'createdAt' => date('c'),
];
// Empreinte du secret d'auteur : permet à l'auteur de supprimer son message
// sans donner le mot de passe d'administration. Le secret n'est jamais renvoyé par l'API.
if ($secret !== '') {
    $msg['owner'] = owner_hash($secret);
}

$messages[] = $msg;
if (count($messages) > MAX_MESSAGES) {
    $messages = array_slice($messages, -MAX_MESSAGES);
}
if (!save_data('forum.json', $messages)) {
    json_out(['ok' => false, 'error' => 'Sauvegarde impossible, réessaie.'], 500);
}

json_out(['ok' => true, 'message' => $msg]);
