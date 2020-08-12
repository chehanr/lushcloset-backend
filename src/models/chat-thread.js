const { Model, UUIDV4 } = require('sequelize');

const logger = require('../loaders/winston');

module.exports = (sequelize, DataTypes) => {
  class ChatThread extends Model {
    static associate(models) {
      this.hasMany(models.ChatUser, {
        as: 'chatUsers',
        foreignKey: 'chatThreadId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // For filtering.
      this.hasMany(models.ChatUser, {
        foreignKey: 'chatThreadId',
      });
      this.hasMany(models.ChatMessage, {
        as: 'chatMessages',
        foreignKey: 'chatThreadId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  ChatThread.init(
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
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterBulkDestroy: async (instance, options) => {
          await sequelize.models.ChatUser.destroy({
            where: { chatThreadId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ChatMessage.destroy({
            where: { chatThreadId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterBulkRestore: async (instance, options) => {
          await sequelize.models.ChatUser.restore({
            where: { chatThreadId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });

          await sequelize.models.ChatMessage.restore({
            where: { chatThreadId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },
      },
      tableName: 'chat_threads',
    }
  );

  return ChatThread;
};
