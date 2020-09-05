const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAvatar extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
      this.belongsTo(models.File, {
        as: 'file',
        foreignKey: 'fileId',
      });
    }
  }

  UserAvatar.init(
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
      tableName: 'user_avatars',
    }
  );

  return UserAvatar;
};
