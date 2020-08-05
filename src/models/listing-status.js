const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingStatus extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        as: 'listing',
        foreignKey: 'listingId',
      });
    }
  }

  ListingStatus.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      statusType: {
        allowNull: false,
        defaultValue: 'available',
        type: DataTypes.ENUM('available', 'rented', 'purchased'),
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      tableName: 'listing_statuses',
    }
  );

  return ListingStatus;
};
