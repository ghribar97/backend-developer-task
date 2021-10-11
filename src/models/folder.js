module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define('Folder', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Folder.associate = (models) => {
    Folder.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    Folder.hasMany(models.Note, {
      foreignKey: 'folder_id',
      as: 'notes'
    });
  };

  Folder.tableName = 'folders';

  return Folder;
};