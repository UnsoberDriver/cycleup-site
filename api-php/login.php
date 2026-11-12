<?php
/** Connexion administratrice — POST {password} → jeton 12 h. */
declare(strict_types=1);
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    json_out(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}

rate_limit('login', 5, 10);

$b = body_json();
$password = clean_text($b['password'] ?? '', 200);

if ($password === '' || !password_verify($password, admin_password_hash())) {
    json_out(['ok' => false, 'error' => 'Mot de passe incorrect.'], 401);
}

$tokens = load_data('tokens.json', []);
json_out([
    'ok' => true,
    'token' => issue_token(),
    'expiresAt' => date('c', time() + 12 * 3600),
]);
