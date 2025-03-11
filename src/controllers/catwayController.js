const Catway = require('../models/Catway');

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.json(catways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCatwayById = async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway not found' });
        }
        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCatway = async (req, res) => {
    const catway = new Catway({
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    });

    try {
        const newCatway = await catway.save();
        res.status(201).json(newCatway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateCatwayState = async (req, res) => {
    try {
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState: req.body.catwayState },
            { new: true }
        );
        
        if (!catway) {
            return res.status(404).json({ message: 'Catway not found' });
        }
        
        res.json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCatway = async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway not found' });
        }
        res.json({ message: 'Catway deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};