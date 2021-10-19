const { createDummyFolder } = require('../services/dummyFactory')

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('folders', [
       createDummyFolder(2),

       createDummyFolder(3),
       createDummyFolder(3),
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('folders', null, {});
  }
};