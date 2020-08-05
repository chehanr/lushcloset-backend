module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('auth_providers', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
          unique: true,
        },
        provider_type: {
          allowNull: false,
          type: Sequelize.ENUM,
          values: ['google', 'facebook', 'twitter', 'github'],
        },
        provider_id: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        user_id: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
      });

      await queryInterface.addIndex(
        'auth_providers',
        ['provider_type', 'user_id'],
        {
          indicesType: 'UNIQUE',
        }
      );

      await queryInterface.addIndex(
        'auth_providers',
        ['provider_type', 'provider_id'],
        {
          indicesType: 'UNIQUE',
        }
      );

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
      await queryInterface.dropTable('auth_providers');

      await queryInterface.removeIndex('users', [
        'provider_type',
        'provider_id',
      ]);

      await queryInterface.removeIndex('users', ['provider_type', 'user_id']);

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
