const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  numeroCatway: {
    type: Number,
    required: true,
    unique: true
  },
  typeCatway: {
    type: String,
    required: true,
    enum: ['long', 'court']
  },
  etatCatway: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Catway', catwaySchema);