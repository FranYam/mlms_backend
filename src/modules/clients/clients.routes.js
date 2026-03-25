// src/modules/clients/clients.routes.js

const express = require('express');
const router = express.Router();
const clientsController = require('./clients.controller');
const auth = require('../../middleware/auth.middleware');
const allowRoles = require('../../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion des clients de la microfinance
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Liste tous les clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher par nom ou téléphone
 *     responses:
 *       200:
 *         description: Liste des clients
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
 *                     $ref: '#/components/schemas/Client'
 *   post:
 *     summary: Ajouter un nouveau client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, address]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ali Traoré
 *               phone:
 *                 type: string
 *                 example: "+226 70 00 00 01"
 *               address:
 *                 type: string
 *                 example: Ouagadougou, Secteur 15
 *               email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Client créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Données invalides
 */
router.get('/', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), clientsController.getAll);
router.post('/', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), clientsController.create);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Détails d'un client avec ses prêts
 *     tags: [Clients]
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
 *         description: Client avec liste de ses prêts
 *       404:
 *         description: Client introuvable
 *   put:
 *     summary: Modifier un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Client modifié
 *   delete:
 *     summary: Supprimer un client (ADMIN uniquement)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client supprimé
 *       403:
 *         description: Réservé à l'Admin
 */
router.get('/:id', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), clientsController.getById);
router.put('/:id', auth, allowRoles('ADMIN', 'LOAN_OFFICER'), clientsController.update);
router.delete('/:id', auth, allowRoles('ADMIN'), clientsController.remove);

module.exports = router;
