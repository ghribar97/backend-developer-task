const { createDummyNoteContent } = require('../services/dummyFactory')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('note_contents', [
       createDummyNoteContent(1),

       createDummyNoteContent(2),
       
       createDummyNoteContent(3),
       createDummyNoteContent(3),
       createDummyNoteContent(3)
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('note_contents', null, {});
  }
};