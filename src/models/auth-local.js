const { Model, UUIDV4 } = require('sequelize');

const logger = require('../loaders/winston');
const authUtils = require('../utils/auth');

module.exports = (sequelize, DataTypes) => {
  class AuthLocal extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
    }

    async isPasswordValid(plainTextPwd) {
      return authUtils.matchPassword(plainTextPwd, this.password);
    }
  }

  AuthLocal.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {
        // eslint-disable-next-line no-return-assign, consistent-return, no-unused-vars
        beforeCreate: async (instance, options) => {
          try {
            // eslint-disable-next-line no-param-reassign
            instance.password = await authUtils.hashPassword(instance.password);
          } catch (error) {
            logger.error(error);

            throw error;
          }
        },
      },
      tableName: 'auth_locals',
    }
  );

  return AuthLocal;
};
