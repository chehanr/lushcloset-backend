const { Model, UUIDV4 } = require('sequelize');

const logger = require('../loaders/winston');

module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
      this.hasOne(models.ListingAddress, {
        as: 'listingAddress',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasOne(models.ListingPrice, {
        as: 'listingPrice',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasOne(models.ListingCategory, {
        as: 'listingCategory',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasOne(models.ListingMetadata, {
        as: 'listingMetadata',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasOne(models.ListingStatus, {
        as: 'listingStatus',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.ListingEnquiry, {
        as: 'listingEnquiries',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.ListingPurchase, {
        as: 'listingPurchases',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.ListingImage, {
        as: 'listingImages',
        foreignKey: 'listingId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Listing.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      listingType: {
        allowNull: false,
        type: DataTypes.ENUM('rent', 'sell'),
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterDestroy: async (instance, options) => {
          await sequelize.models.ListingAddress.destroy({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingPrice.destroy({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingStatus.destroy({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingCategory.destroy({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingMetadata.destroy({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterRestore: async (instance, options) => {
          await sequelize.models.ListingAddress.restore({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingPrice.restore({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingStatus.restore({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingCategory.restore({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingMetadata.restore({
            where: { listingId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterBulkDestroy: async (instance, options) => {
          await sequelize.models.ListingEnquiry.destroy({
            where: { listingId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingPurchase.destroy({
            where: { listingId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingImage.destroy({
            where: { listingId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterBulkRestore: async (instance, options) => {
          await sequelize.models.ListingEnquiry.restore({
            where: { listingId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingPurchase.restore({
            where: { listingId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingImage.restore({
            where: { listingId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },
      },
      tableName: 'listings',
    }
  );

  return Listing;
};
