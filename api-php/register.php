<?php
/**
 * Inscription d'un compte éditorial — POST {name, email, password}.
 * Le premier compte créé reçoit le rôle « admin », les suivants « editeur ».
 */
declare(strict_types=1);
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

reject_if_banned();
rate_limit('register', 60, 5);

$b = body_json();
$name = clean_text($b['name'] ?? '', 80);
$email = clean_text($b['email'] ?? '', 160);
$password = (string) ($b['password'] ?? '');

if (mb_strlen($name) < 2) {
    json_out(['ok' => false, 'error' => 'Indique ton nom (2 caractères minimum).'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['ok' => false, 'error' => 'Adresse e-mail invalide.'], 422);
}
if (strlen($password) < 8) {
    json_out(['ok' => false, 'error' => 'Le mot de passe doit contenir au moins 8 caractères.'], 422);
}
if (find_user($email) !== null) {
    json_out(['ok' => false, 'error' => 'Un compte existe déjà avec cette adresse e-mail.'], 409);
}

$users = load_users();
// Le tout premier compte est administrateur, les suivants éditeurs.
$role = count($users) === 0 ? 'admin' : 'editeur';

$users[] = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'email' => $email,
    'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    'role' => $role,
    'createdAt' => date('c'),
];

if (!save_users($users)) {
    json_out(['ok' => false, 'error' => 'Sauvegarde impossible, réessaie.'], 500);
}

json_out([
    'ok' => true,
    'role' => $role,
    'message' => $role === 'admin'
        ? 'Compte administrateur créé. Tu peux te connecter.'
        : 'Compte créé. Tu peux te connecter et gérer les contenus.',
]);
