var faker = require('faker');

function createDummyUser() {
    return {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        password: faker.internet.password()
    }
}


function createDummyFolder(ownerId) {
    return {
        name: faker.lorem.words(1),
        owner_id: ownerId,
    }
}


function createDummyNote(folderId, type) {
    return {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: faker.random.arrayElement(['PRIVATE', 'PUBLIC']),
        folder_id: folderId,
        type: type
    }
}


function createDummyNoteContent(noteId) {
    return {
        body: faker.lorem.words(100),
        note_id: noteId
    }
}


module.exports = {
    createDummyUser,
    createDummyFolder,
    createDummyNote,
    createDummyNoteContent
}