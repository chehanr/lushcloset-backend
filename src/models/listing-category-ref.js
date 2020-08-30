const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingCategoryRef extends Model {
    static associate(models) {
      this.hasMany(models.ListingCategory, {
        as: 'listingCategories',
        foreignKey: 'listingCategoryRefId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  ListingCategoryRef.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(128),
      },
      attributes: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {},
      tableName: 'listing_category_refs',
    }
  );

  return ListingCategoryRef;
};
