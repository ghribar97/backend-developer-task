const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('note_contents', [
        // 1
        {
          body: faker.lorem.words(100),
          note_id: 1
        },
        // 2
        {
          body: faker.lorem.words(100),
          note_id: 2
        },
        // 3
        {
          body: faker.lorem.words(100),
          note_id: 3
        },
        // 4
        {
          body: faker.lorem.words(100),
          note_id: 4
        },
        // 5
        {
          body: faker.lorem.words(100),
          note_id: 4
        },
        // 6
        {
          body: faker.lorem.words(100),
          note_id: 5
        },
        // 7
        {
          body: faker.lorem.words(100),
          note_id: 6
        },
        // 8
        {
          body: faker.lorem.words(100),
          note_id: 6
        },
        // 9
        {
          body: faker.lorem.words(100),
          note_id: 6
        },
        // 10
        {
          body: faker.lorem.words(100),
          note_id: 7
        },
        // 11
        {
          body: faker.lorem.words(100),
          note_id: 8
        },
        // 12
        {
          body: faker.lorem.words(100),
          note_id: 8
        },
        // 13
        {
          body: faker.lorem.words(100),
          note_id: 9
        },
        // 14
        {
          body: faker.lorem.words(100),
          note_id: 9
        },
        // 15
        {
          body: faker.lorem.words(100),
          note_id: 9
        },
        // 16
        {
          body: faker.lorem.words(100),
          note_id: 9
        }
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('note_contents', null, {});
  }
};