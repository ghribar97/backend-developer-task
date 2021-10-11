var factory = require('../dummyFactory')

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('folders', [
       factory.createDummyFolder(2),

       factory.createDummyFolder(3),
       factory.createDummyFolder(3),
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('folders', null, {});
  }
};