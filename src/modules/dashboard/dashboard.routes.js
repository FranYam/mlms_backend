// src/modules/dashboard/dashboard.routes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const auth = require('../../middleware/auth.middleware');
const allowRoles = require('../../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistiques et indicateurs globaux
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Statistiques globales du système
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPIs du tableau de bord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClients:
 *                       type: integer
 *                       example: 120
 *                     activeLoans:
 *                       type: integer
 *                       example: 45
 *                     totalLoanAmount:
 *                       type: number
 *                       example: 5500000
 *                     overdueLoans:
 *                       type: integer
 *                       example: 8
 *                     loansDueToday:
 *                       type: integer
 *                       example: 3
 */
router.get('/stats', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), dashboardController.getStats);

/**
 * @swagger
 * /dashboard/overdue:
 *   get:
 *     summary: Résumé des prêts en retard pour le tableau de bord
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des prêts en retard avec infos client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       loanId:
 *                         type: string
 *                       clientName:
 *                         type: string
 *                         example: "Ali Traoré"
 *                       clientPhone:
 *                         type: string
 *                       loanAmount:
 *                         type: number
 *                         example: 50000
 *                       dueDate:
 *                         type: string
 *                         format: date
 *                       status:
 *                         type: string
 *                         example: "OVERDUE"
 */
router.get('/overdue', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), dashboardController.getOverdue);

/**
 * @swagger
 * /dashboard/recent-loans:
 *   get:
 *     summary: Derniers prêts créés dans le système
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Les 10 derniers prêts avec infos client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Loan'
 */
router.get('/recent-loans', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), dashboardController.getRecentLoans);

module.exports = router;
