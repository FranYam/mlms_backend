// src/config/swagger.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microfinance Loan Management System (MLMS) API',
      version: '1.0.0',
      description: `
## API REST pour la gestion des clients, prêts et remboursements

### Authentification
1. Appeler \`POST /auth/login\` avec vos identifiants
2. Copier le \`token\` retourné
3. Cliquer sur **Authorize** 🔒 et saisir : \`votre_token\`

### Comptes de test (après \`npm run db:seed\`)
| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@mlms.com | secret123 |
| Loan Officer | officer@mlms.com | secret123 |
| Client | ali.client@mlms.com | secret123 |
      `,
      contact: {
        name: 'MLMS Support',
        email: 'support@mlms.com',
      },
    },
    /* servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur de développement',
      },
    ], */
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via POST /auth/login',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: "Description de l'erreur" },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Jean Dupont' },
            email: { type: 'string', format: 'email', example: 'jean@mlms.com' },
            role: { type: 'string', enum: ['ADMIN', 'LOAN_OFFICER', 'CLIENT'] },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            clientId: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '69b04760133320f47b6a9df0' },
            name: { type: 'string', example: 'Ali Traoré' },
            phone: { type: 'string', example: '+226 70 00 00 01' },
            address: { type: 'string', example: 'Ouagadougou, Secteur 15' },
            email: { type: 'string', format: 'email', nullable: true },
            registeredAt: { type: 'string', format: 'date-time' },
          },
        },
        Loan: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '69b04760133320f47b6a9df0' },
            clientId: { type: 'string', example: '69b04760133320f47b6a9df0' },
            amount: { type: 'number', example: 100000 },
            interestRate: { type: 'number', example: 10 },
            duration: { type: 'integer', example: 12 },
            interest: { type: 'number', example: 10000 },
            totalRepayable: { type: 'number', example: 110000 },
            startDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['ACTIVE', 'COMPLETED', 'OVERDUE'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RepaymentSchedule: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '69b04760133320f47b6a9df0'},
            loanId: { type: 'string', example: '69b04760133320f47b6a9df0' },
            monthNumber: { type: 'integer', example: 1 },
            amountDue: { type: 'number', example: 9167 },
            dueDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['PENDING', 'PAID', 'OVERDUE'] },
          },
        },
        Repayment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '69b04760133320f47b6a9df0'},
            loanId: { type: 'string', example: '69b04760133320f47b6a9df0'},
            scheduleId: { type: 'string', nullable: true, example: '69b04760133320f47b6a9df0' },
            amount: { type: 'number', example: 9167 },
            paidAt: { type: 'string', format: 'date-time' },
            note: { type: 'string', nullable: true, example: 'Paiement effectué' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
