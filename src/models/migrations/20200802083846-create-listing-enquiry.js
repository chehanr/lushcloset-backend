module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('listing_prices', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
          unique: true,
        },
        enquiry_status: {
          allowNull: false,
          defaultValue: 'pending',
          type: Sequelize.ENUM,
          values: ['pending', 'accepted', 'rejected', 'completed'],
        },
        note: {
          type: Sequelize.STRING(256),
        },
        listing_id: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'listings',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
      await queryInterface.dropTable('listing_prices');

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
