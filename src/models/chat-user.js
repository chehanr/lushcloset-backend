const { Model, UUIDV4 } = require('sequelize');

const logger = require('../loaders/winston');

module.exports = (sequelize, DataTypes) => {
  class ChatUser extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
      this.belongsTo(models.ChatThread, {
        as: 'chatThread',
        foreignKey: 'chatThreadId',
      });
      this.hasMany(models.ChatMessage, {
        as: 'chatMessages',
        foreignKey: 'chatUserId',
        hooks: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  ChatUser.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      adminedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterBulkDestroy: async (instance, options) => {
          await sequelize.models.ChatMessage.destroy({
            where: { chatUserId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },

        // eslint-disable-next-line no-unused-vars
        afterBulkRestore: async (instance, options) => {
          await sequelize.models.ChatMessage.restore({
            where: { chatUserId: instance.where?.id },
          }).catch((error) => {
            logger.error(error);
          });
        },
      },
      tableName: 'chat_users',
    }
  );

  return ChatUser;
};
