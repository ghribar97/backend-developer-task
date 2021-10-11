var factory = require('../dummyFactory')

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('note_content', [
       factory.createDummyNoteContent(1),

       factory.createDummyNoteContent(2),
       factory.createDummyNoteContent(3),
       factory.createDummyNoteContent(3),
       factory.createDummyNoteContent(3)
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('note_content', null, {});
  }
};