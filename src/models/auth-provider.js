const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuthProvider extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
    }
  }

  AuthProvider.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      providerType: {
        allowNull: false,
        type: DataTypes.ENUM('google', 'facebook', 'twitter', 'github'),
      },
      providerId: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['provider_type', 'user_id'],
        },
        {
          unique: true,
          fields: ['provider_type', 'provider_id'],
        },
      ],
      tableName: 'auth_providers',
    }
  );

  return AuthProvider;
};
