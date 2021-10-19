const faker = require('faker');
const bcrypt = require('bcrypt');

exports.createDummyUser = async () => {
    return {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        password: await bcrypt.hash('12345', parseInt(process.env.CRYPTO_SALT_ROUNDS)) // same password for testing purposes
    }
};

exports.createDummyFolder = (ownerId) => {
    return {
        name: faker.lorem.words(1),
        owner_id: ownerId,
    }
};

exports.createDummyNote = (ownerId, folderId, type) => {
    return {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: faker.random.arrayElement(['PRIVATE', 'PUBLIC']),
        folder_id: folderId,
        owner_id: ownerId,
        type: type
    }
};

exports.createDummyNoteContent = (noteId) => {
    return {
        body: faker.lorem.words(100),
        note_id: noteId
    }
};
