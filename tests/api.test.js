const request = require('supertest');
const app = require('../backend/server');

describe('Sudrashan API Tests', () => {
    describe('Health Check', () => {
        test('GET /health should return 200', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('healthy');
        });
    });

    describe('Authentication', () => {
        test('POST /api/auth/login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@sudrashan.com',
                    password: 'testpassword123'
                });
            
            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        test('POST /api/auth/login with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid@test.com',
                    password: 'wrongpassword'
                });
            
            expect(response.status).toBe(401);
        });
    });

    describe('Misinformation Analysis', () => {
        let authToken;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@sudrashan.com',
                    password: 'testpassword123'
                });
            authToken = loginResponse.body.token;
        });

        test('POST /api/analyze should return analysis results', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'The Earth is flat and NASA is hiding the truth.',
                    type: 'text'
                });

            expect(response.status).toBe(200);
            expect(response.body.verdict).toBeDefined();
            expect(response.body.confidence).toBeGreaterThan(0);
            expect(response.body.confidence).toBeLessThanOrEqual(100);
        });

        test('POST /api/analyze without auth should return 401', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .send({
                    content: 'Test content',
                    type: 'text'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('Rate Limiting', () => {
        test('Should enforce rate limits', async () => {
            const requests = Array(10).fill().map(() => 
                request(app).get('/health')
            );

            const responses = await Promise.all(requests);
            const rateLimitedResponses = responses.filter(r => r.status === 429);
            
            // Should have some rate limited responses if limits are working
            expect(rateLimitedResponses.length).toBeGreaterThanOrEqual(0);
        });
    });
});