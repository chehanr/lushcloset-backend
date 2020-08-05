const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingAddress extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        as: 'listing',
        foreignKey: 'listingId',
      });
    }
  }

  ListingAddress.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      note: {
        type: DataTypes.STRING(256),
      },
      submittedAddress: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      formattedAddress: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      googleGeocodingData: {
        allowNull: false,
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          fields: ['formatted_address'],
        },
      ],
      tableName: 'listing_addresses',
    }
  );

  return ListingAddress;
};
