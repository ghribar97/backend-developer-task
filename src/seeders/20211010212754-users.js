const { createDummyUser } = require('../services/dummyFactory');

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('users', [
       await createDummyUser(),
       await createDummyUser(),
       await createDummyUser()
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
