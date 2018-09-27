'use strict';

module.exports = (sequelize, DataTypes) => {
  const AlbumPurchase = sequelize.define(
    'albumPurchase',
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      albumId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: true
    }
  );
  AlbumPurchase.associate = ({ user }) => {
    AlbumPurchase.belongsTo(user, { as: 'buyer' });
  };
  return AlbumPurchase;
};
