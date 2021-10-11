const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        notNull: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Folder, {
      foreignKey: 'folder_id',
      as: 'folders'
    });
  };
  
  User.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.CRYPTO_SALT_ROUNDS));
    user.password = hashedPassword;
  })

  User.tableName = 'users';
  return User;
};