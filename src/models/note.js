const Sequelize = require('sequelize');
const { AccessPolicy, NoteType } = require('../types');


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
      type: Sequelize.ENUM(NoteType.TEXT, NoteType.LIST),
      allowNull: false,
    },
    access_policy: {
      type: Sequelize.ENUM(AccessPolicy.PRIVATE, AccessPolicy.PUBLIC),
      allowNull: false,
    },
  });

  Note.associate = (models) => {
    Note.belongsTo(models.Folder, {
      foreignKey: 'folder_id',
      onDelete: 'CASCADE',
    });
    Note.belongsTo(models.User, {
      foreignKey: 'owner_id',
      onDelete: 'CASCADE',
    });
    Note.hasMany(models.NoteContent, {
      foreignKey: 'note_id',
      as: 'note_contents'
    });
  };

  Note.tableName = 'notes';

  return Note;
};