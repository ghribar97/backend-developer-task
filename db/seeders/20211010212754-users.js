var factory = require('../dummyFactory');

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('users', [
       await factory.createDummyUser(),
       await factory.createDummyUser(),
       await factory.createDummyUser()
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
