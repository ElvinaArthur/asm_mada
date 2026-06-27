# Déploiement sur Vercel

## 1. Créer la base de données Vercel Postgres
1. Dashboard Vercel -> Storage -> Create Database -> Postgres
2. Connecter au projet -> les variables d'environnement sont automatiquement ajoutées

## 2. Créer le Vercel Blob Storage
1. Dashboard Vercel -> Storage -> Create -> Blob
2. Connecter au projet

## 3. Variables d'environnement à ajouter manuellement
- `JWT_SECRET` = une chaîne aléatoire de 32+ caractères
- `NEXT_PUBLIC_APP_URL` = https://votre-domaine.vercel.app

## 4. Initialiser la base de données
Après le premier déploiement, appeler:
POST /api/admin/init-db (avec un token admin)

## 5. Pour tester localement
```bash
cp .env.local.example .env.local
# Remplir les variables depuis le dashboard Vercel
npm install
npm run dev
```

## Structure des routes API
- POST /api/auth/login
- POST /api/auth/register
- GET  /api/auth/me
- GET  /api/books
- POST /api/books (admin)
- GET  /api/events
- GET  /api/members
- GET  /api/user/profile
- PUT  /api/user/profile
- GET  /api/admin/users (admin)
- GET  /api/admin/verifications (admin)
- GET  /api/admin/stats (admin)
- POST /api/admin/init-db (admin)
