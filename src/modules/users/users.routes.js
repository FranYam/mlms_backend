// src/modules/users/users.routes.js

const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const auth = require('../../middleware/auth.middleware');
const allowRoles = require('../../middleware/role.middleware');

const adminOnly = [auth, allowRoles('ADMIN')];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs du système (ADMIN uniquement)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
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
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Accès réservé à l'Admin
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean@mlms.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *               role:
 *                 type: string
 *                 enum: [ADMIN, LOAN_OFFICER, CLIENT]
 *                 example: LOAN_OFFICER
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Email déjà utilisé
 */
router.get('/', ...adminOnly, usersController.getAll);
router.post('/', ...adminOnly, usersController.create);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Détails d'un utilisateur
 *     tags: [Users]
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
 *         description: Données de l'utilisateur
 *       404:
 *         description: Utilisateur introuvable
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [ADMIN, LOAN_OFFICER, CLIENT]
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
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
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 */
router.get('/:id', ...adminOnly, usersController.getById);
router.put('/:id', ...adminOnly, usersController.update);
router.delete('/:id', ...adminOnly, usersController.remove);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Activer ou désactiver un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "69b04760133320f47b6a9df0"
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
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: INACTIVE
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Statut invalide
 */
router.patch('/:id/status', ...adminOnly, usersController.updateStatus);

module.exports = router;
