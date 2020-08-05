module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('listing_addresses', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
          unique: true,
        },
        note: {
          type: Sequelize.STRING(256),
        },
        submitted_address: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        formatted_address: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        google_geocoding_data: {
          allowNull: false,
          type: Sequelize.JSONB,
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

      await queryInterface.addIndex('listing_addresses', ['formatted_address']);

      // TODO: Add index on `google_geocoding_data`.

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
      await queryInterface.dropTable('listing_addresses');

      await queryInterface.removeIndex('listing_addresses', [
        'formatted_address',
      ]);

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
