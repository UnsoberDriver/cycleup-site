<?php
/**
 * Console d'administration — GET données, POST actions.
 * Actions : delete {type: forum|contact|photo, id}, setpassword {password},
 *           ban {ip, username, expires, reason}, unban {ip}.
 */
declare(strict_types=1);
require __DIR__ . '/lib.php';

require_token();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    json_out([
        'ok' => true,
        'contacts' => array_values(load_data('contact.json', [])),
        'forum' => array_values(load_data('forum.json', [])),
        'photos' => array_values(load_data('photos.json', [])),
        'bans' => load_bans(),
    ]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

$b = body_json();
$action = clean_text($b['action'] ?? '', 30);

if ($action === 'delete') {
    $type = clean_text($b['type'] ?? '', 20);
    $id = clean_text($b['id'] ?? '', 40);
    if ($id === '' || !in_array($type, ['forum', 'contact', 'photo'], true)) {
        json_out(['ok' => false, 'error' => 'Paramètres invalides.'], 422);
    }
    $file = $type === 'forum' ? 'forum.json' : ($type === 'contact' ? 'contact.json' : 'photos.json');
    $all = load_data($file, []);
    $kept = array_values(array_filter($all, fn ($e) => ($e['id'] ?? '') !== $id));
    if (count($kept) === count($all)) {
        json_out(['ok' => false, 'error' => 'Élément introuvable (déjà supprimé ?).'], 404);
    }
    if (!save_data($file, $kept)) {
        json_out(['ok' => false, 'error' => 'Sauvegarde impossible.'], 500);
    }
    json_out(['ok' => true]);
}

if ($action === 'setpassword') {
    $password = clean_text($b['password'] ?? '', 200);
    if (strlen($password) < 1) {
        json_out(['ok' => false, 'error' => 'Le mot de passe ne peut pas être vide.'], 422);
    }
    if (!save_data('admin.json', ['password_hash' => password_hash($password, PASSWORD_DEFAULT), 'created' => date('c')])) {
        json_out(['ok' => false, 'error' => 'Sauvegarde impossible.'], 500);
    }
    save_data('tokens.json', []); // déconnexion de toutes les sessions
    json_out(['ok' => true]);
}

if ($action === 'ban') {
    $ip = clean_text($b['ip'] ?? '', 45);
    if ($ip === '') {
        json_out(['ok' => false, 'error' => 'Adresse IP manquante.'], 422);
    }
    $username = clean_text($b['username'] ?? '', 50);
    $expires = (int) ($b['expires'] ?? 0);
    $reason = clean_text($b['reason'] ?? '', 200);
    $bans = ban_ip($ip, $username, $expires, $reason);
    json_out(['ok' => true, 'bans' => $bans]);
}

if ($action === 'unban') {
    $ip = clean_text($b['ip'] ?? '', 45);
    if ($ip === '') {
        json_out(['ok' => false, 'error' => 'Adresse IP manquante.'], 422);
    }
    $bans = unban_ip($ip);
    json_out(['ok' => true, 'bans' => $bans]);
}

json_out(['ok' => false, 'error' => 'Action inconnue.'], 422);
