const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingImage extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        as: 'listing',
        foreignKey: 'listingId',
      });
      this.belongsTo(models.File, {
        as: 'file',
        foreignKey: 'fileId',
      });
    }
  }

  ListingImage.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {},
      tableName: 'listing_images',
    }
  );

  return ListingImage;
};
