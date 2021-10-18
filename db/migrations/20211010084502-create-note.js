const { AccessPolicy, NoteType } = require('../../src/types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(NoteType.LIST, NoteType.TEXT),
        allowNull: false
      },
      heading: {
        type: Sequelize.STRING,
        allowNull: false
      },
      access_policy: {
        type: Sequelize.ENUM(AccessPolicy.PUBLIC, AccessPolicy.PRIVATE),
        allowNull: false
      },
      folder_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'folders',
          key: 'id',
          as: 'folder_id',
        },
      },
      owner_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'owner_id',
        },
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notes');
  }
};