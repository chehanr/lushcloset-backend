const { Model, UUIDV4 } = require('sequelize');

const logger = require('../loaders/winston');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.AuthProvider, {
        as: 'authProviders',
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Listing, {
        as: 'listings',
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasOne(models.AuthLocal, {
        as: 'authLocal',
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.ListingEnquiry, {
        as: 'listingEnquiries',
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.ListingPurchase, {
        as: 'listingPurchases',
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.File, {
        as: 'files',
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      email: {
        allowNull: false,
        type: DataTypes.CITEXT,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: DataTypes.STRING(256),
      },
      photoUri: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterDestroy: async (instance, options) => {
          await sequelize.models.AuthLocal.destroy({
            where: { userId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterRestore: async (instance, options) => {
          await sequelize.models.AuthLocal.restore({
            where: { userId: instance.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterBulkDestroy: async (instance, options) => {
          await sequelize.models.AuthProvider.destroy({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingEnquiry.destroy({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingPurchase.destroy({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.File.destroy({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterBulkRestore: async (instance, options) => {
          await sequelize.models.AuthProvider.restore({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingEnquiry.restore({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ListingPurchase.restore({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.File.restore({
            where: { userId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },
      },
      tableName: 'users',
    }
  );

  return User;
};
