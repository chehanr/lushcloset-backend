const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserVerification extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
    }
  }

  UserVerification.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      emailVerifySecret: {
        allowNull: false,
        defaultValue: UUIDV4,
        type: DataTypes.UUID,
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      tableName: 'user_verifications',
    }
  );

  return UserVerification;
};
