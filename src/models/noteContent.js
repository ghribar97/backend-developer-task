module.exports = (sequelize, DataTypes) => {
  const NoteContent = sequelize.define('NoteContent', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });

  NoteContent.associate = (models) => {
    NoteContent.belongsTo(models.Note, {
      foreignKey: 'note_id',
      onDelete: 'CASCADE',
    });
  };

  NoteContent.tableName = 'note_contents';

  return NoteContent;
};