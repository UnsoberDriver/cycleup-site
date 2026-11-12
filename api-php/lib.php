<?php
/**
 * Cyclup — socle commun de l'API (PHP 8.0).
 * Stockage : fichiers JSON dans api/data/ (jamais servis par nginx, location 403).
 */
declare(strict_types=1);

const DATA_DIR = __DIR__ . '/data';

/** Réponse JSON et arrêt. */
function json_out(array $payload, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Corps de la requête (JSON ou formulaire). */
function body_json(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $d = json_decode($raw, true);
    if (is_array($d)) {
        return $d;
    }
    return is_array($_POST) ? $_POST : [];
}

/** Nettoyage basique d'une chaîne. */
function clean_text($v, int $max = 5000): string
{
    $s = is_string($v) ? $v : '';
    $s = str_replace(["\0", "\r"], '', $s);
    $s = trim($s);
    if (strlen($s) > $max) {
        $s = function_exists('mb_substr') ? mb_substr($s, 0, $max, 'UTF-8') : substr($s, 0, $max);
    }
    return $s;
}

/** Lecture d'un fichier de données avec verrou partagé. */
function load_data(string $file, array $default): array
{
    $p = DATA_DIR . '/' . basename($file);
    if (!is_file($p)) {
        return $default;
    }
    $fp = @fopen($p, 'r');
    if (!$fp) {
        return $default;
    }
    @flock($fp, LOCK_SH);
    $raw = stream_get_contents($fp);
    @flock($fp, LOCK_UN);
    fclose($fp);
    $d = json_decode((string) $raw, true);
    return is_array($d) ? $d : $default;
}

/** Écriture atomique d'un fichier de données. */
function save_data(string $file, array $data): bool
{
    if (!is_dir(DATA_DIR) && !@mkdir(DATA_DIR, 0775, true) && !is_dir(DATA_DIR)) {
        return false;
    }
    $p = DATA_DIR . '/' . basename($file);
    $tmp = $p . '.' . getmypid() . '.tmp';
    $fp = @fopen($tmp, 'c');
    if (!$fp) {
        return false;
    }
    $ok = @flock($fp, LOCK_EX)
        && ftruncate($fp, 0)
        && fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)) !== false;
    fflush($fp);
    @flock($fp, LOCK_UN);
    fclose($fp);
    if ($ok) {
        @chmod($tmp, 0664);
        $ok = @rename($tmp, $p);
    }
    if (!$ok) {
        @unlink($tmp);
    }
    return $ok;
}

/** IP du visiteur (Cloudflare / proxy inverse aware). */
function client_ip(): string
{
    $h = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0';
    $parts = explode(',', (string) $h);
    return trim((string) $parts[0]);
}

/**
 * Limite d'abus par IP : intervalle mini entre deux posts + plafond horaire.
 */
function rate_limit(string $bucket, int $min_interval, int $hourly_max): void
{
    $d = load_data('ratelimit.json', []);
    $now = time();
    foreach ($d as $k => $v) {
        if ($now - (int) ($v['last'] ?? 0) > 172800) {
            unset($d[$k]);
        }
    }
    $key = $bucket . '|' . client_ip();
    $e = $d[$key] ?? ['last' => 0, 'hour' => []];
    $hour = [];
    foreach (($e['hour'] ?? []) as $t) {
        if ($now - (int) $t < 3600) {
            $hour[] = (int) $t;
        }
    }
    if ($now - (int) $e['last'] < $min_interval || count($hour) >= $hourly_max) {
        json_out(['ok' => false, 'error' => 'Trop de requêtes depuis cette adresse, réessaie dans un instant.'], 429);
    }
    $hour[] = $now;
    $d[$key] = ['last' => $now, 'hour' => $hour];
    save_data('ratelimit.json', $d);
}

/** Jetons d'administration (12 h, révocables en vidant tokens.json). */
function issue_token(): string
{
    $tokens = load_data('tokens.json', []);
    $now = time();
    $tokens = array_values(array_filter($tokens, fn ($t) => (int) ($t['exp'] ?? 0) > $now));
    $token = bin2hex(random_bytes(32));
    $tokens[] = ['token' => $token, 'exp' => $now + 12 * 3600];
    save_data('tokens.json', $tokens);
    return $token;
}

function require_token(): void
{
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) {
        json_out(['ok' => false, 'error' => 'Authentification requise.'], 401);
    }
    $tokens = load_data('tokens.json', []);
    $now = time();
    foreach ($tokens as $t) {
        if (is_string($t['token'] ?? null)
            && hash_equals($t['token'], $m[1])
            && (int) ($t['exp'] ?? 0) > $now) {
            return;
        }
    }
    json_out(['ok' => false, 'error' => 'Session expirée, reconnecte-toi.'], 401);
}

/** Hachage du mot de passe admin (doit exister dans api/data/admin.json). */
function admin_password_hash(): string
{
    $cfg = load_data('admin.json', []);
    if (empty($cfg['password_hash'])) {
        // Aucun mot de passe par défaut dans le code : l'amorçage se fait
        // côté serveur (fichier api/data/admin.json), jamais via le dépôt.
        json_out(['ok' => false, 'error' => 'Administration non initialisée côté serveur.'], 503);
    }
    return (string) $cfg['password_hash'];
}
