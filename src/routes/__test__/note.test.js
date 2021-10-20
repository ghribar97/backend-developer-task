const request = require('supertest');
const app = require('../../app.js');
const faker = require('faker');
const { executeAuthenticatedUserLogin } = require('./testHelper');
const db = require("../../models");
const { AccessPolicy, NoteType } = require('../../types.js');

describe('Notes API', () => {

    // List notes 
    
    it('should be able to list public notes for non authenticated user', async () => {
        const res = await request(app).get('/api/v1/notes');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 5 }),  // from seed
                expect.objectContaining({ id: 8 }),  // from seed 
                expect.objectContaining({ id: 9 }),  // from seed 
            ])
        );
    }),

    it('should be able to list public notes for authenticated user without notes/folders', async () => {
        const userId = 3;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).get('/api/v1/notes').set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 5 }),  // from seed
                expect.objectContaining({ id: 8 }),  // from seed 
                expect.objectContaining({ id: 9 }),  // from seed 
            ])
        );
    }),

    it('should be able to see public notes and own notes for authenticated users', async () => {
        const userId = 1;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).get('/api/v1/notes').set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1 }),  // from seed 
                expect.objectContaining({ id: 2 }),  // from seed 
                expect.objectContaining({ id: 3 }),  // from seed
                expect.objectContaining({ id: 4 }),  // from seed  
                expect.objectContaining({ id: 5 }),  // from seed
                expect.objectContaining({ id: 8 }),  // from seed 
                expect.objectContaining({ id: 9 }),  // from seed 
            ])
        );
        // TODO: add tests for limit, offset and order
    }),

    // Get note

    it('should be able to get a text public note as non authenticated user', async () => {
        const noteId = 5;
        const res = await request(app).get(`/api/v1/notes/${noteId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');

        const dbNote = await db.Note.findOne({ include: [ { model: db.NoteContent, as: "note_contents", required: false } ], where: { id: noteId }});
        expect(res.body.data).toEqual({"id": noteId, "name": dbNote.name, "heading": dbNote.heading, "type": dbNote.type, "access_policy": dbNote.access_policy, "body": dbNote.note_contents[0].body});
    }),

    it('should not be able to get a private note as non authenticated user', async () => {
        const noteId = 1;
        const res = await request(app).get(`/api/v1/notes/${noteId}`);
        expect(res.statusCode).toEqual(404);
    }),

    it('should be able to get a list private note as authenticated user', async () => {
        const userId = 1;
        const noteId = 3;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const res = await request(app).get(`/api/v1/notes/${noteId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');

        const dbNote = await db.Note.findOne({ include: [ { model: db.NoteContent, as: "note_contents", required: false } ], where: { id: noteId }});
        expect(res.body.data).toEqual({"id": noteId, "name": dbNote.name, "heading": dbNote.heading, "type": dbNote.type, "access_policy": dbNote.access_policy, "items": dbNote.note_contents.map(ct => { return { body: ct.body, id: ct.id }})});
    }),

    // Create note

    it('should be able to create text note as authenticated user', async () => {
        const userId = 1;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "type": NoteType.TEXT, "body": faker.lorem.words(50), "folder_id": 1 };
        const res = await request(app).post(`/api/v1/notes/`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(typeof res.body.data.id).toBe('number');

        const dbNote = await db.Note.findOne({ include: [ { model: db.NoteContent, as: "note_contents", required: false } ], where: { id: res.body.data.id }});
        expect(dbNote).not.toBe(null);
        expect(dbNote.name).toEqual(payload.name);
        expect(dbNote.access_policy).toEqual(payload.access_policy);
        expect(dbNote.heading).toEqual(payload.heading);
        expect(dbNote.type).toEqual(payload.type);
        expect(dbNote.note_contents[0].body).toEqual(payload.body);
    }),

    it('should be able to create list note as authenticated user', async () => {
        const userId = 1;
        const cookie = await executeAuthenticatedUserLogin(userId);
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PRIVATE, "type": NoteType.LIST, "items": [faker.lorem.words(50), faker.lorem.words(100)], "folder_id": 1 };
        const res = await request(app).post(`/api/v1/notes/`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(typeof res.body.data.id).toBe('number');

        const dbNote = await db.Note.findOne({ include: [ { model: db.NoteContent, as: "note_contents", required: false } ], where: { id: res.body.data.id }});
        expect(dbNote).not.toBe(null);
        expect(dbNote.name).toEqual(payload.name);
        expect(dbNote.access_policy).toEqual(payload.access_policy);
        expect(dbNote.heading).toEqual(payload.heading);
        expect(dbNote.type).toEqual(payload.type);
        expect(dbNote.note_contents[0].body).toEqual(payload.items[0]);
        expect(dbNote.note_contents[1].body).toEqual(payload.items[1]);
    }),

    it('should not be able to create new note in folder that doesnt exists', async () => {
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "type": NoteType.TEXT, "body": faker.lorem.words(50), "folder_id": 1000 };
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).post(`/api/v1/notes/`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(404);
    }),

    it('should not be able to create note as non authenticated user', async () => {
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "body": faker.lorem.words(50), "folder_id": 1 };
        const res = await request(app).post(`/api/v1/notes/`).send(payload);
        expect(res.statusCode).toEqual(401);
    }),

    // update note

    it('should not be able to update public note as non authenticated user', async () => {
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "body": faker.lorem.words(50), "folder_id": 1 };
        const noteId = 5;
        const res = await request(app).put(`/api/v1/notes/${noteId}`).send(payload);
        expect(res.statusCode).toEqual(401);
    }),

    it('should not be able to update note that does not exists', async () => {
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "body": faker.lorem.words(50), "folder_id": 1 };
        const noteId = 1000;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).put(`/api/v1/notes/${noteId}`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(404);
    }),

    it('should not be able to update note without owning it', async () => {
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "body": faker.lorem.words(50), "folder_id": 1 };
        const noteId = 5;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).put(`/api/v1/notes/${noteId}`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(404);
    }),

    it('should not be able to update note with non existing folder', async () => {
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "body": faker.lorem.words(50), "folder_id": 1000 };
        const noteId = 5;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).put(`/api/v1/notes/${noteId}`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(404);
    }),

    it('should not be able to update note type', async () => {
        const payload = { "name": "myNote.txt", "heading": "Some dummy heading", "access_policy": AccessPolicy.PUBLIC, "type": NoteType.LIST, "items": [faker.lorem.words(50), faker.lorem.words(50)], "folder_id": 3 };
        const noteId = 5;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).put(`/api/v1/notes/${noteId}`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(400);
    }),

    it('should be able to update text note as authenticated user', async () => {
        const payload = { "name": "newNote.txt", "heading": "Some new dummy heading", "access_policy": AccessPolicy.PUBLIC, "body": faker.lorem.words(50), "folder_id": 1 };
        const noteId = 10;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).put(`/api/v1/notes/${noteId}`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(200);
        const dbNote = await db.Note.findOne({ include: [ { model: db.NoteContent, as: "note_contents", required: false } ], where: { id: noteId }});
        expect(dbNote).not.toBe(null);
        expect(dbNote.name).toEqual(payload.name);
        expect(dbNote.access_policy).toEqual(payload.access_policy);
        expect(dbNote.heading).toEqual(payload.heading);
        expect(dbNote.note_contents[0].body).toEqual(payload.body);
    }),

    // delete note

    it('should not be able to delete public note as non authenticated user', async () => {
        const noteId = 10;
        const res = await request(app).delete(`/api/v1/notes/${noteId}`);
        expect(res.statusCode).toEqual(401);
    }),

    it('should be able to delete note as authenticated user', async () => {
        const noteId = 10;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).delete(`/api/v1/notes/${noteId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);

        const dbNote = await db.Note.findOne({ where: { id: noteId }});
        expect(dbNote).toBe(null);
    }),

    it('should be able to delete note_content after deletion', async () => {
        const noteId = 11;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).delete(`/api/v1/notes/${noteId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);

        const dbNote = await db.Note.findOne({ where: { id: noteId }});
        expect(dbNote).toBe(null);

        const dbNoteContents = await db.NoteContent.findAll({ where: { note_id: noteId }});
        expect(dbNote).toBe(null);
    })

});