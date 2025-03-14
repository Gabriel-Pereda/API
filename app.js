const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { specs } = require('./swagger');
require('dotenv').config();

const paths = require('./src/utils/paths');

// Import routes
const authRoutes = require(path.join(paths.routes, 'authRoutes'));
const userRoutes = require(path.join(paths.routes, 'userRoutes'));
const catwayRoutes = require(path.join(paths.routes, 'catwayRoutes'));
const reservationRoutes = require(path.join(paths.routes, 'reservationRoutes'));

const app = express();

require('events').EventEmitter.defaultMaxListeners = 15;
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection setup
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        console.log('📁 Database:', mongoose.connection.db.databaseName);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📑 Collections:', collections.map(c => c.name));
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

connectDB();

// API Documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
        persistAuthorization: true
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Port de Plaisance API Documentation"
}));

// Welcome route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/catways', catwayRoutes);
app.use('/reservations', reservationRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    
    const status = err.status || 500;
    const response = {
        status: 'error',
        message: err.message || 'Internal server error'
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(status).json(response);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    mongoose.connection.close(false, () => {
        console.log('📤 MongoDB connection closed.');
        process.exit(0);
    });
});

module.exports = app;