const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function listAllDatabases() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");

        // Get list of all databases
        const databasesList = await client.db().admin().listDatabases();
        
        console.log("\n📚 Available Databases:");
        for (const db of databasesList.databases) {
            console.log(`\n📁 Database: ${db.name}`);
            
            // For each database, list its collections
            const database = client.db(db.name);
            const collections = await database.listCollections().toArray();
            
            console.log("Collections:");
            for (const collection of collections) {
                const count = await database.collection(collection.name).countDocuments();
                console.log(`   - ${collection.name}: ${count} documents`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

listAllDatabases();