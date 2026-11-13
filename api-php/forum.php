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
    json_out(['ok' => true, 'messages' => array_values($messages)]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

reject_if_banned();
rate_limit('forum', 20, 10);

$b = body_json();
$topic = clean_text($b['topic'] ?? '', 20);
$author = clean_text($b['author'] ?? '', 60);
$title = clean_text($b['title'] ?? '', 120);
$content = clean_text($b['content'] ?? '', 5000);

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

$msg = [
    'id' => bin2hex(random_bytes(8)),
    'topic' => $topic,
    'author' => $author,
    'title' => $title,
    'content' => $content,
    'createdAt' => date('c'),
];

$messages[] = $msg;
if (count($messages) > MAX_MESSAGES) {
    $messages = array_slice($messages, -MAX_MESSAGES);
}
if (!save_data('forum.json', $messages)) {
    json_out(['ok' => false, 'error' => 'Sauvegarde impossible, réessaie.'], 500);
}

json_out(['ok' => true, 'message' => $msg]);
