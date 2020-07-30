const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingPrice extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        as: 'listing',
        foreignKey: 'listingId',
      });
    }
  }

  ListingPrice.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      value: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      currencyTypeIso: {
        allowNull: false,
        type: DataTypes.STRING(3),
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      tableName: 'listing_prices',
    }
  );

  return ListingPrice;
};
