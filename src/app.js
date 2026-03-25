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
app.use('/api/auth',       require('./modules/auth/auth.routes'));
app.use('/api/users',      require('./modules/users/users.routes'));
app.use('/api/clients',    require('./modules/clients/clients.routes'));
app.use('/api/loans',      require('./modules/loans/loans.routes'));
app.use('/api/repayments', require('./modules/repayments/repayments.routes'));
app.use('/api/dashboard',  require('./modules/dashboard/dashboard.routes'));

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
