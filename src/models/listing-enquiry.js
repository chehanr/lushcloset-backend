const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingEnquiry extends Model {
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

  ListingEnquiry.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      enquiryStatus: {
        allowNull: false,
        defaultValue: 'pending',
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
      },
      note: {
        type: DataTypes.STRING(256),
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      tableName: 'listing_enquiries',
    }
  );

  return ListingEnquiry;
};
