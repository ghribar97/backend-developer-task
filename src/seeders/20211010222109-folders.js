const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('folders', [
      // 1
      {
        name: faker.lorem.words(1),
        owner_id: 1,
      },
      // 2
      {
        name: faker.lorem.words(1),
        owner_id: 1,
      },
      // 3
      {
        name: faker.lorem.words(1),
        owner_id: 2,
      },
      // 4
      {
        name: faker.lorem.words(1),
        owner_id: 2,
      },
      // 5
      {
        name: faker.lorem.words(1),
        owner_id: 2,
      }
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('folders', null, {});
  }
};