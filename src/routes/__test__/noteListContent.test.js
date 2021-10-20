const request = require('supertest');
const app = require('../../app.js');
const faker = require('faker');
const { executeAuthenticatedUserLogin } = require('./testHelper');
const db = require("../../models");

describe('List note items API', () => {

    // add new list item
        
    it('should be able to add list item to accessible note', async () => {
        const noteId = 3;
        const cookie = await executeAuthenticatedUserLogin();
        const payload = {"body": faker.lorem.words(50)};
        const res = await request(app).post(`/api/v1/notes/${noteId}/noteList`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(typeof res.body.data.id).toBe('number');

        const dbNoteContent = await db.NoteContent.findOne({where: { id: res.body.data.id }});
        expect(dbNoteContent).not.toBe(null);
        expect(dbNoteContent.body).toEqual(payload.body);
        expect(dbNoteContent.note_id).toEqual(noteId);
    }),

    it('should not be able to add list item to text note', async () => {
        const noteId = 2;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).post(`/api/v1/notes/${noteId}/noteList`).set('Cookie', cookie).send({"body": faker.lorem.words(50)});
        expect(res.statusCode).toEqual(400);
    }),

    it('should not be able to add list item to inaccessible note', async () => {
        const noteId = 6;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).post(`/api/v1/notes/${noteId}/noteList`).set('Cookie', cookie).send({"body": faker.lorem.words(50)});
        expect(res.statusCode).toEqual(404);
    }),

    // update list items

    it('should be able to edit list item to accessible note', async () => {
        const noteId = 3;
        const contentId = 3;
        const cookie = await executeAuthenticatedUserLogin();
        const payload = {"body": faker.lorem.words(50)};
        const res = await request(app).put(`/api/v1/notes/${noteId}/noteList/${contentId}`).set('Cookie', cookie).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');

        const dbNoteContent = await db.NoteContent.findOne({where: { id: contentId }});
        expect(dbNoteContent.body).toEqual(payload.body);
        expect(dbNoteContent.note_id).toEqual(noteId);
    }),

    it('should not be able to edit unknown list item to unknown note', async () => {
        const noteId = 3;
        const contentId = 1000;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).put(`/api/v1/notes/${noteId}/noteList/${contentId}`).set('Cookie', cookie).send({"body": faker.lorem.words(50)});
        expect(res.statusCode).toEqual(404);
    }),

    // delete list items

    it('should be able to delete list item from accessible note', async () => {
        const noteId = 4;
        const contentId = 4;
        const cookie = await executeAuthenticatedUserLogin();
        const res = await request(app).delete(`/api/v1/notes/${noteId}/noteList/${contentId}`).set('Cookie', cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');

        const dbNoteContent = await db.NoteContent.findOne({where: { id: contentId }});
        expect(dbNoteContent).toBe(null);
    })

});