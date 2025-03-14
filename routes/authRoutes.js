const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const path = require('path');
const { login, logout } = require('../src/controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authentifie un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur authentifié avec succès
 *       401:
 *         description: Échec de l'authentification
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags: [Auth]
 *     summary: Déconnecte l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.get('/logout', auth, logout);

module.exports = router;