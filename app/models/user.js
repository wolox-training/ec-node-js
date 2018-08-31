'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      firstName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['password'] }
      }
    }
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
