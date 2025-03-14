const mongoose = require('mongoose');
const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');
require('dotenv').config();

async function checkCollections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Check Catways
        const catways = await Catway.find({});
        console.log('\n🚢 Catways in database:', catways.length);
        catways.forEach(catway => {
            console.log(`Number: ${catway.catwayNumber}, Type: ${catway.catwayType}, State: ${catway.catwayState}`);
        });

        // Check Reservations
        const reservations = await Reservation.find({});
        console.log('\n📅 Reservations in database:', reservations.length);
        reservations.forEach(res => {
            console.log(`Catway: ${res.catwayNumber}, Client: ${res.clientName}, Boat: ${res.boatName}`);
            console.log(`Period: ${new Date(res.startDate).toLocaleDateString('fr-FR')} - ${new Date(res.endDate).toLocaleDateString('fr-FR')}`);
            console.log('------------------------');
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkCollections();