const request = require('supertest')
const app = require('../../app.js')

describe('User API', () => {
    it('should not authorize unknown user', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({"username": "unknown", "password": "something"});
        expect(res.statusCode).toEqual(401);
    }),
    it('should not authorize known user with wrong password', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({"username": "JohnDoe1", "password": "something"});
        expect(res.statusCode).toEqual(401);
    }),
    it('should not authorize user with lowercase username and wrong password', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({"username": "johndoe1", "password": "something"});
        expect(res.statusCode).toEqual(401);
    }),
    it('should authorize known user with correct password', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({"username": "JohnDoe1", "password": "12345"});
        expect(res.statusCode).toEqual(200);
    }),
    it('should logout user', async () => {
        const res = await request(app).get('/api/v1/auth/logout');
        expect(res.statusCode).toEqual(200);
    })
})