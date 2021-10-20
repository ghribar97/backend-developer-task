const request = require('supertest')
const app = require('../../app.js')

exports.executeAuthenticatedUserLogin = async (userId) => {
    const username = `JohnDoe${userId || 1}`
    const validUserData = {"username": username, "password": "12345"};
    const res = await request(app).post('/api/v1/auth/login').send(validUserData);

    return res.header['set-cookie'][0];
};