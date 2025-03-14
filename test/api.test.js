const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
let token;

describe('API Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Basic test
    it('should return welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Bienvenue dans l Api du port de Plaisance');
    });
    
    describe('Authentication', () => {
        it('should login successfully', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'admin@example.com',
                    password: 'password123'
                });
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            token = res.body.token;
        });
    });

    // Catway tests
    describe('Catway Operations', () => {
        it('should get all catways', async () => {
            const res = await request(app)
                .get('/catways')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // Reservation tests
    describe('Reservation Operations', () => {
        it('should create a new reservation', async () => {
            const res = await request(app)
                .post('/catways/1/reservations')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    clientName: "Test Client",
                    boatName: "Test Boat",
                    startDate: "2025-03-20",
                    endDate: "2025-03-25"
                });
            expect(res.status).toBe(201);
        });
    });
});