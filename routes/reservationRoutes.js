const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const Reservation = require('../src/models/Reservation');
const Catway = require('../src/models/Catway');
const { validateReservation, validateReservationUpdate } = require('../src/middleware/validation');

// GET all reservations for a catway
router.get('/catways/:catwayNumber/reservations', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.catwayNumber });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET specific reservation
router.get('/catways/:catwayNumber/reservations/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        if (reservation.catwayNumber.toString() !== req.params.catwayNumber) {
            return res.status(400).json({ message: 'Reservation does not belong to this catway' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET current reservations
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

// POST create new reservation
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

// PUT update reservation
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

// DELETE reservation
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