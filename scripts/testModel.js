const mongoose = require('mongoose');
const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');
require('dotenv').config();

async function testModels() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find a specific catway and its reservations
        const catwayNumber = 1;
        const catway = await Catway.findOne({ catwayNumber });
        const catwayReservations = await Reservation.find({ catwayNumber })
            .sort({ startDate: 1 });

        console.log('\n🚢 Catway Details:');
        console.log({
            number: catway.catwayNumber,
            type: catway.catwayType,
            state: catway.catwayState,
            id: catway._id.toString()
        });

        console.log('\n📅 Reservations for this catway:');
        catwayReservations.forEach(res => {
            console.log({
                client: res.clientName,
                boat: res.boatName,
                period: `${new Date(res.startDate).toLocaleDateString('fr-FR')} - ${new Date(res.endDate).toLocaleDateString('fr-FR')}`
            });
        });

        // Get availability status
        const availableCatways = await Catway.find({
            catwayState: 'bon état'
        }).sort({ catwayNumber: 1 });

        console.log('\n✨ Available Catways:', availableCatways.length);
        console.log('First 3 available:', availableCatways.slice(0, 3).map(c => c.catwayNumber));

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testModels();