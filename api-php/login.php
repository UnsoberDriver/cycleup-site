<?php
/**
 * Connexion — POST {password} (compte admin) ou POST {email, password} (compte éditorial).
 */
declare(strict_types=1);
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

rate_limit('login', 5, 10);

$b = body_json();
$password = (string) ($b['password'] ?? '');
$email = clean_text($b['email'] ?? '', 160);

if ($password === '') {
    json_out(['ok' => false, 'error' => 'Mot de passe manquant.'], 422);
}

/* ---- Connexion par compte éditorial (email + mot de passe) ---- */
if ($email !== '') {
    $user = find_user($email);
    if ($user === null || !password_verify($password, (string) ($user['password_hash'] ?? ''))) {
        json_out(['ok' => false, 'error' => 'Identifiant ou mot de passe incorrect.'], 401);
    }
    $role = (string) ($user['role'] ?? 'editeur');
    json_out([
        'ok' => true,
        'token' => issue_token($role, (string) $user['email'], (string) $user['name']),
        'role' => $role,
        'name' => (string) ($user['name'] ?? ''),
        'expiresAt' => date('c', time() + 12 * 3600),
    ]);
}

/* ---- Connexion administrateur (mot de passe global) ---- */
if (!password_verify($password, admin_password_hash())) {
    json_out(['ok' => false, 'error' => 'Mot de passe incorrect.'], 401);
}

json_out([
    'ok' => true,
    'token' => issue_token('admin'),
    'role' => 'admin',
    'expiresAt' => date('c', time() + 12 * 3600),
]);
