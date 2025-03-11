const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const Catway = require('../src/models/Catway');
const { validateCatway, validateCatwayUpdate } = require('../src/middleware/validation'); 

// GET all catways
router.get('/', auth, async (req, res) => {
    try {
        const catways = await Catway.find({});
        res.json(catways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET catway by number
router.get('/:catwayNumber', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) return res.status(404).json({ message: 'Catway not found' });
        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new catway
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

// PUT update catway state only
router.put('/:catwayNumber', auth, validateCatwayUpdate, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) return res.status(404).json({ message: 'Catway not found' });

        catway.catwayState = req.body.catwayState;
        await catway.save();
        res.json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE catway
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