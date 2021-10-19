module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('note_contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      body: {
        type: Sequelize.TEXT
      },
      note_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'notes',
          key: 'id',
          as: 'note_id',
        },
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('note_contents');
  }
};