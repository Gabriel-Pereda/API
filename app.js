const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);
    // Log collection names
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) console.log('Error getting collections:', err);
      else console.log('Collections:', collections.map(c => c.name));
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route should be first
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Marina Management API' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/catways', catwayRoutes);
app.use('/catways', reservationRoutes); // Changed from '/' to '/catways'

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;