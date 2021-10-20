const { AccessPolicy, NoteType } = require('../types');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('notes', [
      // 1
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PRIVATE,
        folder_id: 1,
        owner_id: 1,
        type: NoteType.TEXT
      },
      // 2
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PRIVATE,
        folder_id: 1,
        owner_id: 1,
        type: NoteType.TEXT
      },
      // 3
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PRIVATE,
        folder_id: 1,
        owner_id: 1,
        type: NoteType.LIST
      },
      // 4
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PRIVATE,
        folder_id: 2,
        owner_id: 1,
        type: NoteType.LIST
      },
      // 5
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PUBLIC,
        folder_id: 3,
        owner_id: 2,
        type: NoteType.TEXT
      },
      // 6
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PRIVATE,
        folder_id: 3,
        owner_id: 2,
        type: NoteType.LIST
      },
      // 7
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PRIVATE,
        folder_id: 3,
        owner_id: 2,
        type: NoteType.TEXT
      },
      // 8
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PUBLIC,
        folder_id: 5,
        owner_id: 2,
        type: NoteType.LIST
      },
      // 9
      {
        name: faker.system.fileName(),
        heading: faker.lorem.words(3),
        access_policy: AccessPolicy.PUBLIC,
        folder_id: 5,
        owner_id: 2,
        type: NoteType.LIST
      }
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notes', null, {});
  }
};