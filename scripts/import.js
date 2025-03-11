const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');

// Connection string (replace with your actual connection string)
const MONGODB_URI = "mongodb+srv://gabrielperedacarmona:4U8V6qmVSo4qx8d6@cluster0.patre.mongodb.net/marina";

// Sample data
const catways = [
    {
        "numeroCatway": 1,
        "typeCatway": "long",
        "etatCatway": "Bon état"
    },
    {
        "numeroCatway": 2,
        "typeCatway": "court",
        "etatCatway": "Nécessite réparation"
    },
    {
        "numeroCatway": 3,
        "typeCatway": "long",
        "etatCatway": "Excellent état"
    }
];

const reservations = [
    {
        "numeroCatway": 1,
        "nomClient": "Jean Dupont",
        "nomBateau": "Le Navigator",
        "dateDebut": "2025-03-15",
        "dateFin": "2025-03-20"
    },
    {
        "numeroCatway": 2,
        "nomClient": "Marie Martin",
        "nomBateau": "Sea Explorer",
        "dateDebut": "2025-03-18",
        "dateFin": "2025-03-25"
    }
];

async function importData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Catway.deleteMany();
        await Reservation.deleteMany();
        console.log('Cleared existing data');

        // Import catways
        await Catway.insertMany(catways);
        console.log('Catways imported successfully');

        // Import reservations
        await Reservation.insertMany(reservations);
        console.log('Reservations imported successfully');

        console.log('All data imported successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

importData();