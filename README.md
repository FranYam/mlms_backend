# 🏦 MLMS Backend — Microfinance Loan Management System

API REST complète pour la gestion des clients, prêts et remboursements.
**Stack : Node.js + Express + MongoDB (Mongoose) + JWT**

---

## 🚀 Démarrage rapide

### 1. Prérequis
- Node.js v18+
- MongoDB (local) **ou** compte MongoDB Atlas gratuit

### 2. Installation

```bash
npm install
cp .env.example .env
# → Éditer .env et renseigner MONGODB_URI
```

### 3. Configurer MongoDB

**Option A — Local**
```env
MONGODB_URI="mongodb://localhost:27017/mlms_db"
```

**Option B — MongoDB Atlas (cloud gratuit)**
1. Créer un compte sur https://cloud.mongodb.com
2. Créer un cluster gratuit (M0)
3. Copier la connection string dans `.env` :
```env
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mlms_db"
```

### 4. Insérer les données de test

```bash
npm run seed
```

### 5. Démarrer

```bash
npm run dev    # développement
npm start      # production
```

### 6. Accéder à la documentation

| URL | Description |
|---|---|
| `http://localhost:3000/api-docs` | **Swagger UI** |
| `http://localhost:3000` | Route racine |

---

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| **Admin** | admin@mlms.com | secret123 |
| **Loan Officer** | officer@mlms.com | secret123 |
| **Client** | ali.client@mlms.com | secret123 |

---

## 🗂️ Structure

```
mlms-backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Connexion MongoDB
│   │   └── swagger.js       # Config Swagger
│   ├── models/              # Modèles Mongoose
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Loan.js
│   │   ├── RepaymentSchedule.js
│   │   └── Repayment.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── modules/             # auth / users / clients / loans / repayments / dashboard
│   ├── utils/
│   ├── seed.js
│   ├── app.js
│   └── server.js            # Démarrage + CRON
├── .env.example
└── package.json
```
