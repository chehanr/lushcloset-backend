const { v4: uuidv4 } = require('uuid');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'listing_category_refs',
      [
        {
          id: uuidv4(),
          name: 'Bags & Luggage',
          attributes: JSON.stringify({
            metadata: {
              brandName: {
                required: false,
              },
              condition: {
                required: false,
              },
            },
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          name: "Women's Clothing & Shoes",
          attributes: JSON.stringify({
            metadata: {
              brandName: {
                required: false,
              },
              size: {
                required: false,
              },
              condition: {
                required: false,
              },
            },
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          name: "Men's Clothing & Shoes",
          attributes: JSON.stringify({
            metadata: {
              brandName: {
                required: false,
              },
              size: {
                required: false,
              },
              condition: {
                required: false,
              },
            },
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Jewelry & Accessories',
          attributes: JSON.stringify({
            metadata: {
              brandName: {
                required: false,
              },
              condition: {
                required: false,
              },
            },
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('listing_category_refs', null, {});
  },
};
