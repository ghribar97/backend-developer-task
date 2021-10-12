var factory = require('../dummyFactory')

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('notes', [
       factory.createDummyNote(2, 1, 'TEXT'),

       factory.createDummyNote(3, 2, 'TEXT'),
       factory.createDummyNote(3, 2, 'LIST')
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notes', null, {});
  }
};