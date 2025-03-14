const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function verifyData() {
    let client;
    try {
        // First connection to get raw data
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db("database");
        
        // Fetch and display existing data
        const rawCatways = await db.collection('catways').find({}).toArray();
        console.log('\n🚢 Catways found:', rawCatways.length);
        console.log('Sample catway:', JSON.stringify(rawCatways[0], null, 2));
        
        const rawReservations = await db.collection('reservations').find({}).toArray();
        console.log('\n📅 Reservations found:', rawReservations.length);
        console.log('Sample reservation:', JSON.stringify(rawReservations[0], null, 2));

        // Connect with Mongoose just to verify schema
        await mongoose.connect(MONGODB_URI);
        console.log('\n✅ Connected to MongoDB via Mongoose');

        // Count documents using Mongoose models
        const catwayCount = await Catway.countDocuments();
        const reservationCount = await Reservation.countDocuments();
        
        console.log('\n📊 Mongoose Model Counts:');
        console.log(`Catways: ${catwayCount}`);
        console.log(`Reservations: ${reservationCount}`);

        await mongoose.connection.close();
        await client.close();

    } catch (error) {
        console.error('❌ Error:', error);
        if (client) await client.close();
        if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
        process.exit(1);
    }
}

verifyData();