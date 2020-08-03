module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('listing_rentals', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
          unique: true,
        },
        rental_status: {
          allowNull: false,
          defaultValue: 'pending',
          type: Sequelize.ENUM,
          values: ['pending', 'picked', 'returned', 'cancelled'],
        },
        picked_at: {
          type: Sequelize.DATE,
        },
        returned_at: {
          type: Sequelize.DATE,
        },
        cancelled_at: {
          type: Sequelize.DATE,
        },
        enquiry_id: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'listing_enquiries',
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
      await queryInterface.dropTable('listing_rentals');

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
