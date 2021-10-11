const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    heading: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('TEXT', 'LIST'),
      allowNull: false,
    },
    access_policy: {
      type: Sequelize.ENUM('PRIVATE', 'PUBLIC'),
      allowNull: false,
    },
  });

  Note.associate = (models) => {
    Note.belongsTo(models.Folder, {
      foreignKey: 'folder_id',
      onDelete: 'CASCADE',
    });
    Note.hasMany(models.NoteContent, {
      foreignKey: 'note_id',
      as: 'noteContent'
    });
  };

  Note.tableName = 'notes';

  return Note;
};