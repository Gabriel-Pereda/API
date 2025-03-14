const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const path = require('path');
const { validateCatway, validateCatwayUpdate } = require('../src/middleware/validation');
const Reservation = require(path.join(__dirname, '..', 'src', 'models', 'Reservation'));
const Catway = require(path.join(__dirname, '..', 'src', 'models', 'Catway'));

/**
 * @swagger
 * /catways:
 *   get:
 *     tags: [Catways]
 *     summary: Récupère tous les catways
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', auth, async (req, res) => {
    try {
        const catways = await Catway.find({});
        console.log('Found catways:', catways.length); // Debug log
        res.json(catways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   get:
 *     tags: [Catways]
 *     summary: Récupère un catway par son numéro
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Catway trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:catwayNumber', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) return res.status(404).json({ message: 'Catway not found' });
        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways:
 *   post:
 *     tags: [Catways]
 *     summary: Crée un nouveau catway
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       201:
 *         description: Catway créé
 *       400:
 *         description: Numéro de catway déjà existant
 */
router.post('/', auth, validateCatway, async (req, res) => {
    try {
        const existingCatway = await Catway.findOne({ catwayNumber: req.body.catwayNumber });
        if (existingCatway) {
            return res.status(400).json({ message: 'Catway number already exists' });
        }
        
        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   put:
 *     tags: [Catways]
 *     summary: Met à jour l'état d'un catway
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: number
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catway mis à jour
 *       404:
 *         description: Catway non trouvé
 */
router.put('/:catwayNumber', auth, async (req, res) => {
    try {
        console.log('Updating catway:', req.params.catwayNumber, req.body); // Debug log

        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.catwayNumber },
            { catwayState: req.body.catwayState },
            { new: true }
        );
        
        if (!catway) {
            return res.status(404).json({ message: 'Catway not found' });
        }

        res.json(catway);
    } catch (error) {
        console.error('Update catway error:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   delete:
 *     tags: [Catways]
 *     summary: Supprime un catway
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 */
router.delete('/:catwayNumber', auth, async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.catwayNumber });
        if (!catway) return res.status(404).json({ message: 'Catway not found' });
        res.json({ message: 'Catway deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;