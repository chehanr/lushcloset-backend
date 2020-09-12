module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.sequelize.query(
        'CREATE EXTENSION IF NOT EXISTS cube;'
      );
      await queryInterface.sequelize.query(
        'CREATE EXTENSION IF NOT EXISTS earthdistance;'
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
      await queryInterface.sequelize.query(
        'DROP EXTENSION IF EXISTS earthdistance;'
      );
      await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS cube;');

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
