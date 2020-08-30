const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingCategory extends Model {
    static associate(models) {
      this.belongsTo(models.Listing, {
        as: 'listing',
        foreignKey: 'listingId',
      });
      this.belongsTo(models.ListingCategoryRef, {
        as: 'listingCategoryRef',
        foreignKey: 'listingCategoryRefId',
      });
    }
  }

  ListingCategory.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {},
      tableName: 'listing_categories',
    }
  );

  return ListingCategory;
};
