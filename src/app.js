// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { errorResponse } = require('./utils/response');
const connectDB = require('./config/database');

const app = express();

// Initialize DB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: true },
  customSiteTitle: 'MLMS API Docs',
  customCss: '.swagger-ui .topbar { background-color: #1a5276; }',
}));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Routes
// Load route modules
const authRoutes       = require('./modules/auth/auth.routes');
const usersRoutes      = require('./modules/users/users.routes');
const clientsRoutes    = require('./modules/clients/clients.routes');
const loansRoutes      = require('./modules/loans/loans.routes');
const repaymentsRoutes = require('./modules/repayments/repayments.routes');
const dashboardRoutes  = require('./modules/dashboard/dashboard.routes');

// Routes avec préfixe /api (Standard)
app.use('/api/auth',       authRoutes);
app.use('/api/users',      usersRoutes);
app.use('/api/clients',    clientsRoutes);
app.use('/api/loans',      loansRoutes);
app.use('/api/repayments', repaymentsRoutes);
app.use('/api/dashboard',  dashboardRoutes);

// Routes sans préfixe (pour plus de flexibilité lors du déploiement)
app.use('/auth',       authRoutes);
app.use('/users',      usersRoutes);
app.use('/clients',    clientsRoutes);
app.use('/loans',      loansRoutes);
app.use('/repayments', repaymentsRoutes);
app.use('/dashboard',  dashboardRoutes);

app.get('/', (req, res) => res.json({
  success: true,
  message: "Bienvenue sur l'API MLMS (MongoDB)",
  version: '1.0.0',
  docs: '/api-docs',
}));

app.use((req, res) => errorResponse(res, `Route introuvable : ${req.method} ${req.originalUrl}`, 404));
app.use((err, req, res, next) => {
  console.error('❌ Erreur non gérée :', err);
  errorResponse(res, err.isOperational ? err.message : 'Erreur interne du serveur', err.statusCode || 500);
});

module.exports = app;
