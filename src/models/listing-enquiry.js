const { Model, UUIDV4 } = require('sequelize');

const logger = require('../loaders/winston');

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
      this.hasOne(models.ListingRental, {
        as: 'listingRental',
        foreignKey: 'listingEnquiryId',
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
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterDestroy: async (instance, options) => {
          await sequelize.models.ListingRental.destroy({
            where: { listingEnquiryId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterRestore: async (instance, options) => {
          await sequelize.models.ListingRental.restore({
            where: { listingEnquiryId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });
        },
      },
      tableName: 'listing_enquiries',
    }
  );

  return ListingEnquiry;
};
