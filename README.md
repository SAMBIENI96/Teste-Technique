# Tutor

Prototype de matching automatique entre élèves et tuteurs : le parent renseigne le niveau, la matière et les disponibilités de son enfant, consulte les tuteurs compatibles classés par pertinence, puis réserve un créneau confirmé immédiatement, sans intervention d'un administrateur.

## Installation

Prérequis : PHP 8.3+, Composer, Node 20+, Docker.

```bash
git clone https://github.com/SAMBIENI96/tutor-match.git
cd tutor-match

# Base de données PostgreSQL
cp .env.example .env
docker compose up -d

# API Laravel
cd api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed

# Front React
cd ../web
cp .env.example .env
npm install
```

## Lancement

Dans deux terminaux :

```bash
cd api && php artisan serve    # API : http://localhost:8000/api
cd web && npm run dev          # Site : http://localhost:5173
```

Tests (base `tutor_match_test`, créée automatiquement par Docker) :

```bash
cd api && php artisan test
```

Remettre les données de démonstration à zéro : `php artisan migrate:fresh --seed`.

## Principaux choix techniques

**Matching** — `api/app/Services/MatchingService.php`, réglages dans `api/config/matching.php`.

1. Filtre éliminatoire, appliqué avant tout classement : le tuteur enseigne la matière **à ce niveau** et a au moins un créneau libre dans les moments choisis (14 prochains jours).
2. Score sur 100 : disponibilité (35) · note des élèves (25) · expérience (20) · nombre de cours (10) · adéquation à l'objectif (10). Les poids se modifient dans la configuration, sans toucher au code.
3. La note est une moyenne bayésienne : un tuteur noté 5,0 sur 3 avis ne passe pas devant un tuteur noté 4,9 sur 87 avis.
4. Chaque tuteur affiche des raisons lisibles (« 5 créneaux compatibles », « Noté 4,9 sur 87 avis »).

**Réservation** — `api/app/Services/BookingService.php`. Transaction avec verrou sur le créneau (`lockForUpdate`) et contrainte `UNIQUE` sur `bookings.slot_id` : une double réservation est impossible et renvoie `409`. Le créneau réservé n'est plus proposé.

**Fuseau horaire** — Les créneaux sont enregistrés en `timestamptz` et affichés dans le fuseau `Africa/Casablanca`, quel que soit celui du navigateur.

**Expérience utilisateur** — Formulaire sans clavier (puces et grille jours × moments, raccourcis « Tous les soirs », « Week-end »). Réservation directement depuis la carte du tuteur, dans un tiroir (panneau en bas d'écran sur mobile) avec 3 champs. Si aucun tuteur n'est libre, le site propose d'élargir aux autres moments. Ajout du cours à l'agenda (`.ics`).

**Sécurité** — Validation de toutes les entrées, vérification que le tuteur enseigne bien la matière réservée, limites de requêtes, CORS limité au front, aucune donnée de contact renvoyée par l'API.

**Hors périmètre** (conformément à l'énoncé) — Authentification, paiement, emails, visioconférence.

## Technologies utilisées

| Couche | Technologies |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7, TanStack Query 5, Framer Motion, Axios, Lucide |
| Backend | Laravel 13 (PHP 8.3+), API REST JSON |
| Base de données | PostgreSQL 16 (Docker) |
| Tests | PHPUnit (15 tests : réservation et matching) |
