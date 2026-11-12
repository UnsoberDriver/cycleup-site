# Cycle'Up — site et forum

Site web et espace communautaire du projet **Cycle'Up Pyrénées** : une histoire critique des mobilités numériques, des promesses de la FING (2012) aux communs de la Fabrique des Mobilités, avec un forum ouvert et une galerie photo de rosalies.

En ligne : **https://cycleup.a-is.dev/**

## Structure du dépôt

```
.
├── src/                    # Source du site (React 19 + Vite 8 + Tailwind v4)
│   ├── content/            # Pages, glossaire, bibliographie, acteurs (données TS)
│   ├── pages/              # Forum, contact, administration, pages de contenu
│   ├── components/         # Logo, galerie Rosalie, blocs de rendu…
│   └── lib/api.ts          # Client de l'API (same-origin /api/)
├── api-php/                # Backend PHP 8 (déployé dans api/ sur le serveur)
│   ├── forum.php           # Forum public — GET liste / POST message
│   ├── contact.php         # Formulaire de contact — POST
│   ├── photos.php          # Galerie photo des rosalies — GET / POST
│   ├── login.php           # Connexion admin → jeton 12 h
│   ├── admin.php           # Données + modération (requiert jeton)
│   └── lib.php             # Socle commun : stockage JSON verrouillé, anti-abus
└── .figma/make/site.json   # Titre, favicon, CSP, preconnect
```

## Développement

```bash
pnpm install
pnpm build     # → dist/
pnpm dev       # serveur de développement Vite
```

## Déploiement

Le site est hébergé sur un **Synology DS214** (nginx + PHP-FPM 8.0 via WebStation) :

1. `pnpm build` puis copier le contenu de `dist/` vers `/volume1/web/Cycleup/` (partage SMB `//NAS/web`).
2. Copier `api-php/*.php` vers `/volume1/web/Cycleup/api/`.
3. Pour chaque route (`/partie-1/…`, `/ressources/…`, `/contact/…`), servir une copie de `index.html` (dossiers physiques : l'origine n'interprète pas les règles de réécriture).
4. Le routage PHP du vhost est assuré par `location ~* \.(php|phtml)$` → socket `php-fpm` (profil WebStation), configuré via `user.conf` du vhost.

## Backend

Stockage : fichiers JSON dans `api/data/` (**jamais servis par nginx** — `location /api/data/ → 403`), écritures atomiques verrouillées (`flock`). Aucune base de données nécessaire.

| Endpoint | Méthodes | Rôle |
|---|---|---|
| `/api/forum.php` | GET, POST | Messages du forum (5 topics), partagés entre visiteurs |
| `/api/contact.php` | POST | Messages de contact (nom, email, objet, type) |
| `/api/photos.php` | GET, POST | Galerie photo des rosalies (dataURL JPEG/PNG/WebP ≤ 1,6 Mo) |
| `/api/login.php` | POST | Connexion admin → jeton porteur 12 h |
| `/api/admin.php` | GET, POST | Données du site ; actions `delete` (forum/contact/photo) et `setpassword` |

Mesures anti-abus : limitation par IP (intervalle minimal + plafond horaire par endpoint), piège anti-robot sur le contact, validation stricte de tous les champs côté serveur, mots de passe hachés (`password_hash`), comparaison à temps constant.

### Administration

- Connexion sur `/connexion/` puis console sur `/administration/` : messages de contact, forum et photos avec suppression serveur.
- Modération publique : les boutons « Supprimer » du forum et de la galerie demandent le mot de passe admin.
- Le mot de passe n'apparaît **jamais dans le code** : il est haché dans `api/data/admin.json` (hors dépôt). Pour le réinitialiser, créer ce fichier côté serveur (`password_hash()`) ou utiliser l'action `setpassword`.

### Frontend et repli

Le forum, la galerie et le contact sont branchés sur l'API ; si le serveur est momentanément injoignable, les contributions sont conservées en `localStorage` puis affichées localement jusqu'au retour du service.

## Données personnelles

Le site ne trace personne : pas de cookies, pas de tiers analytics. Le formulaire de contact et les contributions du forum sont stockés sur le serveur du site uniquement ; l'IP des messages de contact n'est conservée que sous forme de haché (anti-abus).
