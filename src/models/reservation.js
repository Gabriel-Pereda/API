const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
        ref: 'Catway'
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    boatName: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

// Validation that end date is after start date
reservationSchema.pre('save', function(next) {
    if (this.startDate >= this.endDate) {
        next(new Error('La date de fin doit être après la date de début'));
    }
    next();
});

module.exports = mongoose.model('Reservation', reservationSchema);