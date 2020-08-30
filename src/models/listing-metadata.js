const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingMetadata extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        as: 'listing',
        foreignKey: 'listingId',
      });
    }
  }

  ListingMetadata.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      size: {
        type: DataTypes.STRING(64),
      },
      brandName: {
        type: DataTypes.STRING(128),
      },
      condition: {
        type: DataTypes.ENUM('new', 'used_like_new', 'used_good', 'used_fair'),
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {},
      tableName: 'listing_metadata',
    }
  );

  return ListingMetadata;
};
