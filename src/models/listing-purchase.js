const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingPurchase extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        as: 'listing',
        foreignKey: 'listingId',
      });
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
    }
  }

  ListingPurchase.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      purchaseStatus: {
        allowNull: false,
        defaultValue: 'pending',
        type: DataTypes.ENUM('pending', 'picked', 'cancelled'),
      },
      pickVerifyCode: {
        allowNull: false,
        defaultValue: UUIDV4,
        type: DataTypes.UUID,
      },
      pickedAt: {
        type: DataTypes.DATE,
      },
      cancelledAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      tableName: 'listing_purchases',
    }
  );

  return ListingPurchase;
};
