const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    static associate(models) {
      this.belongsTo(models.ChatThread, {
        as: 'chatThread',
        foreignKey: 'chatThreadId',
      });
      this.belongsTo(models.ChatUser, {
        as: 'chatUser',
        foreignKey: 'chatUserId',
      });
    }
  }

  ChatMessage.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      tableName: 'chat_messages',
    }
  );

  return ChatMessage;
};
