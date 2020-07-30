module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.sequelize.query(
        'CREATE EXTENSION IF NOT EXISTS citext;'
      );

      await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
          unique: true,
        },
        email: {
          allowNull: false,
          type: Sequelize.CITEXT,
          unique: true,
        },
        name: {
          type: Sequelize.STRING(256),
        },
        photo_uri: {
          type: Sequelize.TEXT,
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

      await queryInterface.addIndex('users', ['email'], {
        indicesType: 'UNIQUE',
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
      await queryInterface.dropTable('users');

      await queryInterface.removeIndex('users', ['email']);

      await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS citext;');

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
