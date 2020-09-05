module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('user_avatars', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
          unique: true,
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
      await queryInterface.dropTable('user_avatars');

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
