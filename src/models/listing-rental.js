const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingRental extends Model {
    static associate(models) {
      this.belongsTo(models.ListingEnquiry, {
        as: 'listingEnquiry',
        foreignKey: 'listingEnquiryId',
      });
    }
  }

  ListingRental.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      rentalStatus: {
        allowNull: false,
        defaultValue: 'pending',
        type: DataTypes.ENUM('pending', 'picked', 'returned', 'cancelled'),
      },
      pickedAt: {
        type: DataTypes.DATE,
      },
      returnedAt: {
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
      tableName: 'listing_rentals',
    }
  );

  return ListingRental;
};
