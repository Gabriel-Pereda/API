const axios = require('axios');

const API_URL = 'http://localhost:3000';
let token;

async function testAPI() {
    try {
        // 1. Login
        console.log('🔑 Testing login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@port-plaisance.fr',
            password: 'Admin123!'
        });
        token = loginResponse.data.token;
        console.log('✅ Login successful\n');

        // 2. Get catways
        console.log('🚢 Testing GET /catways...');
        const catwaysResponse = await axios.get(`${API_URL}/catways`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Found catways:', catwaysResponse.data.length);
        console.log('Sample catway:', catwaysResponse.data[0], '\n');

        // 3. Get reservations for catway #1
        console.log('📅 Testing GET /catways/1/reservations...');
        const reservationsResponse = await axios.get(`${API_URL}/catways/1/reservations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Found reservations:', reservationsResponse.data.length);
        if (reservationsResponse.data.length > 0) {
            console.log('Sample reservation:', reservationsResponse.data[0]);
        }

    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', {
                status: error.response.status,
                message: error.response.data
            });
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

testAPI();