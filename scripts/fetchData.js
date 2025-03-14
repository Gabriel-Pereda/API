const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function fetchData() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Use the 'database' database
        const database = client.db("database");

        // List all collections
        const collections = await database.listCollections().toArray();
        console.log("\nCollections found:", collections.map(c => c.name));

        // Fetch catways
        const catwaysCollection = database.collection("catways");
        const catways = await catwaysCollection.find({}).toArray();
        console.log("\nCatways found:", catways.length);

        // Fetch reservations
        const reservationsCollection = database.collection("reservations");
        const reservations = await reservationsCollection.find({}).toArray();
        console.log("\nReservations found:", reservations.length);

        // Print sample data
        if (catways.length > 0) {
            console.log("\nSample catway:", catways[0]);
        }
        if (reservations.length > 0) {
            console.log("\nSample reservation:", reservations[0]);
        }

    } finally {
        await client.close();
    }
}

fetchData().catch(console.error);