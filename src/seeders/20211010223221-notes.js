const { createDummyNote } = require('../services/dummyFactory')

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('notes', [
       createDummyNote(2, 1, 'TEXT'),

       createDummyNote(3, 2, 'TEXT'),
       createDummyNote(3, 2, 'LIST')
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notes', null, {});
  }
};