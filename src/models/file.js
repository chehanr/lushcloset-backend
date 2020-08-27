const { Model, UUIDV4 } = require('sequelize');

const logger = require('../loaders/winston');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
      this.hasMany(models.FileLink, {
        as: 'fileLinks',
        foreignKey: 'fileId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  File.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      purpose: {
        allowNull: false,
        type: DataTypes.ENUM('listing_image', 'user_avatar', 'other'),
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterBulkDestroy: async (instance, options) => {
          await sequelize.models.FileLink.destroy({
            where: { fileId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterBulkRestore: async (instance, options) => {
          await sequelize.models.FileLink.restore({
            where: { fileId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },
      },
      tableName: 'files',
    }
  );

  return File;
};
