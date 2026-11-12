<?php
/** Formulaire de contact — POST uniquement. */
declare(strict_types=1);
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

$b = body_json();

// Piège à robots : champ caché "website" doit rester vide.
if (clean_text($b['website'] ?? '', 100) !== '') {
    json_out(['ok' => true]);
}

rate_limit('contact', 30, 5);

$name = clean_text($b['name'] ?? '', 80);
$email = clean_text($b['email'] ?? '', 160);
$subject = clean_text($b['subject'] ?? '', 200);
$category = clean_text($b['category'] ?? '', 40);
$message = clean_text($b['message'] ?? '', 8000);

if (mb_strlen($name) < 2) {
    json_out(['ok' => false, 'error' => 'Indique ton nom (2 caractères minimum).'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['ok' => false, 'error' => 'Adresse e-mail invalide.'], 422);
}
if (mb_strlen($message) < 10) {
    json_out(['ok' => false, 'error' => 'Le message doit contenir au moins 10 caractères.'], 422);
}

$entry = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'category' => $category,
    'message' => $message,
    'createdAt' => date('c'),
    'ip' => hash('sha256', client_ip() . 'cycleup-sel'),
];

$all = load_data('contact.json', []);
$all[] = $entry;
if (count($all) > 2000) {
    $all = array_slice($all, -2000);
}
if (!save_data('contact.json', $all)) {
    json_out(['ok' => false, 'error' => 'Sauvegarde impossible, réessaie.'], 500);
}

json_out(['ok' => true]);
