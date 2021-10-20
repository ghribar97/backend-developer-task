const request = require('supertest');
const app = require('../../app.js');
const faker = require('faker');
const { executeAuthenticatedUserLogin } = require('./testHelper');
const db = require("../../models");

describe('Folder API', () => {

    // List folders 
    
    it('should be unauthorized for listing folders to unauthenticated user', async () => {
        const res = await request(app).get('/api/v1/folders');
        expect(res.statusCode).toEqual(401);
    }),

    it('should be able to list user folders', async () => {
        const userId = 1;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).get('/api/v1/folders').set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, name: expect.any(String) }),  // from seed
                expect.objectContaining({ id: 2, name: expect.any(String) }),  // from seed 
            ])
        );
        // TODO: add tests for limit, offset and order
    }),

    // Get folder

    it('should be able to get a specific folder', async () => {
        const userId = 1;
        const folderId = 2;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).get(`/api/v1/folders/${folderId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');

        const dbFolder = await db.Folder.findOne({ where: { id: folderId }});
        expect(res.body.data).toEqual({"id": folderId, "name": dbFolder.name, "notes": expect.any(Array) });
    }),

    it('should not get folder without user owning it', async () => {
        const userId = 3;
        const folderId = 2;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).get(`/api/v1/folders/${folderId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(404);
    }),

    // Create folder

    it('should be unauthorized for creating folder to unauthenticated user', async () => {
        const res = await request(app).post('/api/v1/folders').send({"name": "newFolder"});
        expect(res.statusCode).toEqual(401);
    }),

    it('should be able to create new folder', async () => {
        const cookie = await executeAuthenticatedUserLogin();
        const folderName = faker.lorem.words(1);
        const res = await request(app).post('/api/v1/folders').set('Cookie', cookie).send({"name": folderName});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(typeof res.body.data.id).toBe('number');

        const dbFolder = await db.Folder.findOne({ where: { id: res.body.data.id }});
        expect(dbFolder).not.toBe(null);
        expect(dbFolder.name).toEqual(folderName);
    }),

    it('should not be able to create new folder with invalid input', async () => {
        const cookie = await executeAuthenticatedUserLogin();
        var res = await request(app).post('/api/v1/folders').set('Cookie', cookie).send({"name": 30});
        expect(res.statusCode).toEqual(400);

        res = await request(app).post('/api/v1/folders').set('Cookie', cookie).send({});
        expect(res.statusCode).toEqual(400);
    }),

    // update folder

    it('should be able to update a folder', async () => {
        const userId = 1;
        const folderId = 6;
        const newName = "newName";
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).put(`/api/v1/folders/${folderId}`).set('Cookie', cookie).send({ "name": newName });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');

        const dbFolder = await db.Folder.findOne({ where: { id: folderId }});
        expect(dbFolder.name).toEqual(newName);
        expect(dbFolder.owner_id).toEqual(userId);
    }),

    it('should not be able to update folder without owning it', async () => {
        const userId = 2;
        const folderId = 6;
        const newName = "newName";
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).put(`/api/v1/folders/${folderId}`).set('Cookie', cookie).send({ "name": newName });
        expect(res.statusCode).toEqual(404);
    }),

    // delete folder

    it('should not be able to delete unknown folder', async () => {
        const userId = 2;
        const folderId = 1000;
        const newName = "newName";
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).delete(`/api/v1/folders/${folderId}`).set('Cookie', cookie).send({ "name": newName });
        expect(res.statusCode).toEqual(404);
    }),

    it('should not be able to delete owning folder', async () => {
        const userId = 1;
        const folderId = 6;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).delete(`/api/v1/folders/${folderId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);

        const dbFolder = await db.Folder.findOne({ where: { id: folderId }});
        expect(dbFolder).toBe(null);
    }),

    it('should not be able to delete folder without owning it', async () => {
        const userId = 3;
        const folderId = 6;
        const newName = "newName";
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).delete(`/api/v1/folders/${folderId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(404);
    })
});