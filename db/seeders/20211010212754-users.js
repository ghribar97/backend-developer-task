var factory = require('../dummyFactory')

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('users', [
       factory.createDummyUser(),
       factory.createDummyUser(),
       factory.createDummyUser()
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
