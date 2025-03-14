const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdminUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        const adminData = {
            username: 'admin',
            email: 'admin@port-plaisance.fr',
            password: await bcrypt.hash('Admin123!', 10),
            role: 'admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            await mongoose.connection.close();
            return;
        }

        // Create new admin user
        const admin = new User(adminData);
        await admin.save();
        
        console.log('✅ Admin user created successfully:');
        console.log('   Email:', adminData.email);
        console.log('   Role:', adminData.role);
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();