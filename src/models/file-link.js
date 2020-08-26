const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FileLink extends Model {
    static associate(models) {
      this.belongsTo(models.File, {
        as: 'file',
        foreignKey: 'fileId',
      });
    }
  }

  FileLink.init(
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
      },
      storageProvider: {
        allowNull: false,
        type: DataTypes.ENUM('b2', 's3', 'local'),
      },
      storageBucketName: {
        type: DataTypes.STRING(64),
      },
      storageFileId: {
        type: DataTypes.TEXT,
      },
      fileName: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      fileSize: {
        type: DataTypes.INTEGER,
      },
      fileContentType: {
        type: DataTypes.STRING(128),
      },
      metadata: {
        type: DataTypes.JSONB,
      },
      uploadedAt: {
        type: DataTypes.DATE,
      },
      expiresAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      hooks: {},
      tableName: 'file_links',
    }
  );

  return FileLink;
};
