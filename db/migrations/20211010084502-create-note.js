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
        type: Sequelize.ENUM('LIST', 'TEXT'),
        allowNull: false
      },
      heading: {
        type: Sequelize.STRING,
        allowNull: false
      },
      access_policy: {
        type: Sequelize.ENUM('PRIVATE', 'PUBLIC'),
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notes');
  }
};