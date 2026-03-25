// src/modules/repayments/repayments.routes.js

const express = require('express');
const router = express.Router();
const repaymentsController = require('./repayments.controller');
const auth = require('../../middleware/auth.middleware');
const allowRoles = require('../../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Repayments
 *   description: Enregistrement et suivi des paiements
 */

/**
 * @swagger
 * /repayments:
 *   post:
 *     summary: Enregistrer un paiement
 *     tags: [Repayments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [loanId, amount]
 *             properties:
 *               loanId:
 *                 type: string
 *                 example: "69b04760133320f47b6a9df0"
 *               scheduleId:
 *                 type: string
 *                 nullable: true
 *                 description: Échéance concernée (optionnel)
 *               amount:
 *                 type: number
 *                 example: 9167
 *               note:
 *                 type: string
 *                 nullable: true
 *                 example: "Paiement mois 1"
 *     responses:
 *       201:
 *         description: Paiement enregistré — l'échéance passe à PAID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Repayment'
 *       400:
 *         description: Données invalides ou prêt déjà soldé
 *       404:
 *         description: Prêt ou échéance introuvable
 */
router.post('/', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), repaymentsController.record);

/**
 * @swagger
 * /repayments/loan/{loanId}:
 *   get:
 *     summary: Historique de tous les paiements d'un prêt
 *     tags: [Repayments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *           example: "69b04760133320f47b6a9df0"
 *     responses:
 *       200:
 *         description: Historique des paiements
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
 *                     $ref: '#/components/schemas/Repayment'
 *       404:
 *         description: Prêt introuvable
 */
router.get('/loan/:loanId', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), repaymentsController.getByLoan);

/**
 * @swagger
 * /repayments/loan/{loanId}/pending:
 *   get:
 *     summary: Échéances restantes (PENDING ou OVERDUE) d'un prêt
 *     tags: [Repayments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *           example: "69b04760133320f47b6a9df0"
 *     responses:
 *       200:
 *         description: Échéances non encore payées
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
 *                     $ref: '#/components/schemas/RepaymentSchedule'
 */
router.get('/loan/:loanId/pending', auth, allowRoles('ADMIN', 'LOAN_OFFICER', 'CLIENT'), repaymentsController.getPending);

module.exports = router;
