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

/** Jetons de session (12 h, révocables en vidant tokens.json). */
function issue_token(string $role = 'admin', string $email = '', string $name = ''): string
{
    $tokens = load_data('tokens.json', []);
    $now = time();
    $tokens = array_values(array_filter($tokens, fn ($t) => (int) ($t['exp'] ?? 0) > $now));
    $token = bin2hex(random_bytes(32));
    $tokens[] = [
        'token' => $token,
        'exp' => $now + 12 * 3600,
        'role' => $role,
        'email' => $email,
        'name' => $name,
    ];
    save_data('tokens.json', $tokens);
    return $token;
}

/**
 * Vérifie le jeton et renvoie ses informations (role, email, name).
 * Un jeton sans rôle (anciennement émis) est considéré comme administrateur.
 */
function require_token(): array
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
            return [
                'role' => (string) ($t['role'] ?? 'admin'),
                'email' => (string) ($t['email'] ?? ''),
                'name' => (string) ($t['name'] ?? ''),
            ];
        }
    }
    json_out(['ok' => false, 'error' => 'Session expirée, reconnecte-toi.'], 401);
}

/** Exige le rôle administrateur (ou éditeur pour les actions de contenu). */
function require_admin(): array
{
    $info = require_token();
    if (!in_array($info['role'], ['admin', 'editeur'], true)) {
        json_out(['ok' => false, 'error' => 'Réservé à l’équipe éditoriale.'], 403);
    }
    return $info;
}

/** Liste des comptes utilisateurs (api/data/users.json). */
function load_users(): array
{
    $users = load_data('users.json', []);
    return array_values(array_filter($users, fn ($u) => is_array($u) && !empty($u['email'])));
}

function save_users(array $users): bool
{
    return save_data('users.json', array_values($users));
}

/** Retrouve un compte par son e-mail (insensible à la casse). */
function find_user(string $email): ?array
{
    $needle = mb_strtolower(trim($email));
    foreach (load_users() as $u) {
        if (mb_strtolower((string) ($u['email'] ?? '')) === $needle) {
            return $u;
        }
    }
    return null;
}

/**
 * Liste des mots insultants / malveillants bloqués à la publication.
 * Liste courte et explicite : on bloque l'injure franche, pas le vocabulaire courant.
 */
/**
 * Liste des mots censurés : insultes, grossierités, slurs et menaces.
 * Le filtrage se fait sur le mot entier (voir find_abuse) pour éviter les
 * faux positifs : « dispute » n'est pas « pute », « pédale » n'est pas « pédé ».
 */
const MODERATION_WORDS = [
    // Insultes courantes
    'connard', 'connasse', 'conne', 'connerie', 'conneries', 'salope', 'salaud', 'salopard',
    'pute', 'putes', 'putain', 'puta', 'encule', 'enculé', 'enculer', 'enfoire', 'enfoiré',
    'batard', 'bâtard', 'bastard', 'merde', 'merdeux', 'merdeuse', 'chier', 'chie',
    'couilles', 'couille', 'bite', 'débile', 'debile', 'imbécile', 'imbecile',
    'crétin', 'cretin', 'abruti', 'abrutie', 'idiot', 'idiote', 'tapette', 'pédé',
    'fils de chienne', 'fils de putain', 'niquer', 'nique', 'débiles', 'imbéciles',
    // Vulgarités supplémentaires
    'enculage', 'pute enculée', 'salope de merde', 'crisse', 'foutre', 'niqué',
    // Discours de haine et injures discriminantes
    'nègre', 'negre', 'nigger', 'faggot', 'bitch', 'cunt', 'asshole', 'dickhead',
    'motherfucker', 'whore', 'sale noir', 'salejuif', 'sale arabe', 'sale blanc',
    'sale blanche', 'sale race', 'sale immigrant', 'sale étrangers',
    // Menaces
    'je vais te tuer', 'je te tuerai', 'je vais te défoncer', 'je te défoncerai',
    'va te faire', 'je vais te casser', 'on va te buter', 'menace de mort',
    'je te trouve', 'tuer ta mère', 'tuer ta mere', 'je vais te crever',
];

/**
 * Motifs regex : spam, pubs, arnaques et liens non sollicités.
 */
const MODERATION_PATTERNS = [
    'lien externe' => '#https?://#i',
    'adresse web' => '#\bwww\.[a-z0-9-]+\.[a-z]{2,}#i',
    'adresse e-mail' => '#\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b#i',
    'numéro de téléphone' => '#\b(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}\b#',
    'messagerie instantanée' => '#\b(whatsapp|telegram|signal|snapchat|tiktok|discord)\b#i',
    'jeux d’argent' => '#\b(casino|poker|jackpot|winner|lucky)\b#i',
    'crypto' => '#\b(bitcoin|btc|ethereum|crypto|forex)\b#i',
    'produits suspects' => '#\b(viagra|cialis|camgirl|escort|prostitu[eé]e?|pornograph\w*|sexcam)\b#i',
    'demande de clic' => '#\b(cliquez?\s+ici|clique\s+sur\s+ce\s+lien|gagnez\s+\d+|offre\s+limit[eé]e)\b#i',
    'répétition anormale' => '#(\w)\1{6,}#u',
];

/**
 * Renvoie le premier mot censuré trouvé dans les champs donnés.
 *
 * Le filtrage se fait sur le mot entier (frontières de lettres/chiffres), en
 * tolérant les séparateurs à l’intérieur (« c-o-n-n-a-r-d »), afin de ne pas
 * bloquer des mots anodins qui contiendraient une insulte par hasard.
 */
function find_abuse(array $fields): ?string
{
    foreach ($fields as $field) {
        $s = mb_strtolower((string) $field);
        if ($s === '') {
            continue;
        }
        foreach (MODERATION_WORDS as $word) {
            $letters = preg_split('//u', mb_strtolower($word), -1, PREG_SPLIT_NO_EMPTY);
            if (!$letters) {
                continue;
            }
            $pattern = '/(?<![\p{L}\p{N}])' . implode('[\s\-_.!*\'’]*', array_map('preg_quote', $letters)) . '(?![\p{L}\p{N}])/u';
            if (preg_match($pattern, $s) === 1) {
                return $word;
            }
        }
        foreach (MODERATION_PATTERNS as $label => $pattern) {
            if (preg_match($pattern, $s) === 1) {
                return $label;
            }
        }
    }
    return null;
}

/**
 * Refuse la publication si le contenu est insultant.
 * Enregistre un avertissement ; au-delà du seuil, l'adresse est bannie automatiquement.
 */
function reject_if_abusive(array $fields, string $bucket = 'forum'): void
{
    $word = find_abuse($fields);
    if ($word === null) {
        return;
    }
    $strikes = register_strike($bucket);
    // On ne réécrit pas le terme censuré dans le message d'erreur : inutile
    // d'apprendre l'insulte, et le message restepubliable tel quel.
    $isSpam = in_array($word, array_keys(MODERATION_PATTERNS), true);
    $reason = $isSpam
        ? 'Ce message ressemble à du spam ou à une publicité.'
        : 'Ce message contient une insulte ou un terme injurieux.';
    if ($strikes >= 3) {
        ban_ip(client_ip(), '', 24, 'Envois répétés de messages non conformes (3 avertissements).');
        json_out([
            'ok' => false,
            'error' => 'Publication refusée. Troisième avertissement : votre adresse est bloquée 24 h.',
            'banned' => true,
        ], 403);
    }
    json_out([
        'ok' => false,
        'error' => 'Publication refusée : ' . $reason . ' Rédigons autrement.',
        'banned' => false,
    ], 422);
}

/**
 * Compteur d'avertissements par IP et par type de publication.
 */
function register_strike(string $bucket): int
{
    $d = load_data('strikes.json', []);
    $now = time();
    foreach ($d as $k => $v) {
        if ($now - (int) ($v['last'] ?? 0) > 604800) {
            unset($d[$k]);
        }
    }
    $key = $bucket . '|' . client_ip();
    $e = $d[$key] ?? ['count' => 0, 'last' => 0];
    $e['count'] = (int) ($e['count'] ?? 0) + 1;
    $e['last'] = $now;
    $d[$key] = $e;
    save_data('strikes.json', $d);
    return (int) $e['count'];
}

/**
 * Hachage du secret d'auteur : permet à l'auteur de supprimer son propre message
 * sans transmettre le mot de passe d'administration.
 */
function owner_hash(string $secret): string
{
    return hash('sha256', $secret);
}

/**
 * Marque un message comme banni (contenu insultant ou malveillant signalé).
 * Le message reste visible mais est signalé en rouge à l'administration.
 */
function ban_message(string $id, string $reason = ''): bool
{
    $messages = load_data('forum.json', []);
    $found = false;
    foreach ($messages as &$m) {
        if (($m['id'] ?? '') === $id) {
            $m['banned'] = true;
            $m['bannedReason'] = $reason !== '' ? $reason : 'Contenu signalé';
            $m['bannedAt'] = date('c');
            $found = true;
            break;
        }
    }
    unset($m);
    if (!$found) {
        return false;
    }
    return save_data('forum.json', $messages);
}

/** Retire le marquage « banni » d'un message. */
function unban_message(string $id): bool
{
    $messages = load_data('forum.json', []);
    $found = false;
    foreach ($messages as &$m) {
        if (($m['id'] ?? '') === $id) {
            unset($m['banned'], $m['bannedReason'], $m['bannedAt']);
            $found = true;
            break;
        }
    }
    unset($m);
    if (!$found) {
        return false;
    }
    return save_data('forum.json', $messages);
}

/**
 * Liste des IP bannies (api/data/bans.json).
 * Chaque ban : { ip, username, expires (heures, 0 = permanent), reason, created }.
 */
function load_bans(): array
{
    $bans = load_data('bans.json', []);
    $now = time();
    $valid = [];
    foreach ($bans as $b) {
        if (!is_array($b) || empty($b['ip'])) {
            continue;
        }
        $exp = (int) ($b['expires'] ?? 0);
        if ($exp === 0 || $now < strtotime('+' . $exp . ' hours')) {
            $valid[] = $b;
        }
    }
    return $valid;
}

/** Sauvegarde la liste des bans (purge les expirés au passage). */
function save_bans(array $bans): bool
{
    return save_data('bans.json', array_values($bans));
}

/** Bannit une IP. Retourne la liste complète des bans actifs. */
function ban_ip(string $ip, string $username = '', int $expires = 0, string $reason = ''): array
{
    $bans = load_bans();
    $bans = array_values(array_filter($bans, fn ($b) => ($b['ip'] ?? '') !== $ip));
    $bans[] = [
        'ip' => $ip,
        'username' => $username,
        'expires' => max(0, $expires),
        'reason' => $reason,
        'created' => date('c'),
    ];
    usort($bans, fn ($a, $b) => strcmp((string) ($b['created'] ?? ''), (string) ($a['created'] ?? '')));
    save_bans($bans);
    return $bans;
}

/** Lève un bannissement. */
function unban_ip(string $ip): array
{
    $bans = array_values(array_filter(load_bans(), fn ($b) => ($b['ip'] ?? '') !== $ip));
    save_bans($bans);
    return $bans;
}

/**
 * Bloque la publication si l'IP du visiteur est bannie.
 * À appeler dans chaque endpoint public acceptant des écritures.
 */
function reject_if_banned(): void
{
    $ip = client_ip();
    foreach (load_bans() as $b) {
        if (($b['ip'] ?? '') === $ip) {
            $reason = trim((string) ($b['reason'] ?? ''));
            json_out([
                'ok' => false,
                'error' => $reason !== ''
                    ? 'Publication refusée : ' . $reason
                    : 'Publication refusée : votre adresse est bannie de ce site.',
                'banned' => true,
            ], 403);
        }
    }
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
