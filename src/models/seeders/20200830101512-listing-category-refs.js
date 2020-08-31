module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'listing_category_refs',
      [
        {
          id: '0d9eadba-0e08-4d11-8a70-e1663b4fb84c',
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
          id: '08bd1837-17e6-4a4d-8cd5-45fa325fd816',
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
          id: 'a32f7b0d-c5bb-4b8a-8067-81717d304a8f',
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
          id: 'eaa6a676-979c-409d-96d4-083254016e1b',
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
    return queryInterface.bulkDelete(
      'listing_category_refs',
      {
        id: [
          '0d9eadba-0e08-4d11-8a70-e1663b4fb84c',
          '08bd1837-17e6-4a4d-8cd5-45fa325fd816',
          'a32f7b0d-c5bb-4b8a-8067-81717d304a8f',
          'eaa6a676-979c-409d-96d4-083254016e1b',
        ],
      },
      {}
    );
  },
};
