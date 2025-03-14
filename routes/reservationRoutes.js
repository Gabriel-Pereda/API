const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const Reservation = require('../src/models/Reservation');
const Catway = require('../src/models/Catway');
const { validateReservation, validateReservationUpdate } = require('../src/middleware/validation');

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Récupère toutes les réservations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({}).sort({ startDate: 1 });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/catways/{catwayNumber}/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Récupère les réservations d'un catway
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
 *         description: Liste des réservations pour ce catway
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/catways/:catwayNumber/reservations', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ 
            catwayNumber: req.params.catwayNumber 
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/current:
 *   get:
 *     tags: [Reservations]
 *     summary: Récupère les réservations en cours
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations actives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/:catwayNumber/reservations', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ 
            catwayNumber: req.params.catwayNumber 
        }).sort({ startDate: 1 });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching catway reservations:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/catways/{catwayNumber}/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Crée une nouvelle réservation
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Période déjà réservée ou données invalides
 *       404:
 *         description: Catway non trouvé
 */
router.get('/current', auth, async (req, res) => {
    try {
        const currentDate = new Date();
        const reservations = await Reservation.find({
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/catways/{catwayNumber}/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Crée une nouvelle réservation
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Période déjà réservée ou données invalides
 *       404:
 *         description: Catway non trouvé
 */
router.post('/catways/:catwayNumber/reservations', auth, validateReservation, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) return res.status(404).json({ message: 'Catway not found' });

        // Check for overlapping reservations
        const overlapping = await Reservation.findOne({
            catwayNumber: req.params.catwayNumber,
            $or: [
                {
                    startDate: { $lt: req.body.endDate },
                    endDate: { $gt: req.body.startDate }
                }
            ]
        });

        if (overlapping) {
            return res.status(400).json({ message: 'This time period overlaps with an existing reservation' });
        }

        const reservation = new Reservation({
            ...req.body,
            catwayNumber: req.params.catwayNumber
        });
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/catways/{catwayNumber}/reservations/{id}:
 *   put:
 *     tags: [Reservations]
 *     summary: Met à jour une réservation
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       404:
 *         description: Réservation non trouvée
 */
router.put('/catways/:catwayNumber/reservations/:id', auth, validateReservationUpdate, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        if (reservation.catwayNumber.toString() !== req.params.catwayNumber) {
            return res.status(400).json({ message: 'Reservation does not belong to this catway' });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                reservation[key] = req.body[key];
            }
        });

        await reservation.save();
        res.json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/catways/{catwayNumber}/reservations/{id}:
 *   delete:
 *     tags: [Reservations]
 *     summary: Supprime une réservation
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation non trouvée
 */
router.delete('/catways/:catwayNumber/reservations/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        if (reservation.catwayNumber.toString() !== req.params.catwayNumber) {
            return res.status(400).json({ message: 'Reservation does not belong to this catway' });
        }

        await reservation.deleteOne();
        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;