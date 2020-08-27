module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('file_links', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
          unique: true,
        },
        storage_provider: {
          allowNull: false,
          type: Sequelize.ENUM,
          values: ['b2', 's3', 'local'],
        },
        storage_bucket_name: {
          type: Sequelize.STRING(64),
        },
        storage_file_id: {
          type: Sequelize.TEXT,
        },
        file_name: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        file_size: {
          type: Sequelize.INTEGER,
        },
        file_content_type: {
          type: Sequelize.STRING(128),
        },
        metadata: {
          type: Sequelize.JSONB,
        },
        uploaded_at: {
          type: Sequelize.DATE,
        },
        expires_at: {
          type: Sequelize.DATE,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deleted_at: {
          type: Sequelize.DATE,
        },
        file_id: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'files',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      });

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('file_links');

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
