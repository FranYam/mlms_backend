// src/modules/loans/loans.routes.js

const express = require('express');
const router = express.Router();
const loansController = require('./loans.controller');
const auth = require('../../middleware/auth.middleware');
const allowRoles = require('../../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Gestion des prêts
 */

/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Liste tous les prêts
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des prêts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Loan'
 *   post:
 *     summary: Créer un prêt (calcul auto des intérêts + génération du calendrier)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, amount, interestRate, duration]
 *             properties:
 *               clientId:
 *                 type: string
 *                 example: "69b04760133320f47b6a9df0"
 *               amount:
 *                 type: number
 *                 example: 100000
 *                 description: Montant principal du prêt
 *               interestRate:
 *                 type: number
 *                 example: 10
 *                 description: "Taux d'interet en pourcentage (ex: 10 pour 10%)"
 *               duration:
 *                 type: integer
 *                 example: 12
 *                 description: Durée en mois
 *     responses:
 *       201:
 *         description: Prêt créé — interest, totalRepayable et calendrier calculés automatiquement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Loan'
 *                     - type: object
 *                       properties:
 *                         schedule:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/RepaymentSchedule'
 *       400:
 *         description: Champs manquants
 *       404:
 *         description: Client introuvable
 */
router.get('/', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), loansController.getAll);
router.post('/', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), loansController.create);

/**
 * @swagger
 * /loans/overdue:
 *   get:
 *     summary: Liste des prêts en retard (OVERDUE)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prêts avec statut OVERDUE et leurs échéances en retard
 */
router.get('/overdue', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), loansController.getOverdue);

/**
 * @swagger
 * /loans/my:
 *   get:
 *     summary: Prêts du client connecté (rôle CLIENT uniquement)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des prêts avec calendriers
 *       403:
 *         description: Réservé aux clients
 */
router.get('/my', auth, allowRoles('CLIENT'), loansController.getMyLoan);

/**
 * @swagger
 * /loans/client/{clientId}:
 *   get:
 *     summary: Prêts d'un client spécifique
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           example: "69b04760133320f47b6a9df0"
 *     responses:
 *       200:
 *         description: Prêts du client
 *       404:
 *         description: Client introuvable
 */
router.get('/client/:clientId', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), loansController.getByClient);

/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     summary: Détails complets d'un prêt
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "69b04760133320f47b6a9df0"
 *     responses:
 *       200:
 *         description: Prêt avec client, calendrier et paiements
 *       404:
 *         description: Prêt introuvable
 */
router.get('/:id', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), loansController.getById);

/**
 * @swagger
 * /loans/{id}/schedule:
 *   get:
 *     summary: Calendrier de remboursement d'un prêt
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "69b04760133320f47b6a9df0"
 *     responses:
 *       200:
 *         description: Tableau des échéances mensuelles
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
 *       404:
 *         description: Prêt introuvable
 */
router.get('/:id/schedule', auth, allowRoles('ADMIN', 'LOAN_OFFICER', 'CLIENT'), loansController.getSchedule);

/**
 * @swagger
 * /loans/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'un prêt (ADMIN uniquement)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, COMPLETED, OVERDUE]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', auth, allowRoles('ADMIN'), loansController.updateStatus);

module.exports = router;
