'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Spots',
    [
      {
        ownerId: 3,
        address: '241 Main st.',
        city: 'Seattle',
        state: 'Washington',
        country: 'United States',
        lat: 123.4598290,
        lng: 90.4590234,
        name: 'The Bay House',
        description: 'A bay house',
        price: 45
      },
      {
        ownerId: 2,
        address: '41 George Washington Way',
        city: 'Madison',
        state: 'Wisconsin',
        country: 'United States',
        lat: 589.9034957,
        lng: 21.6793456,
        name: 'Temp House',
        description: 'A temp house',
        price: 635
      },
      {
        ownerId: 1,
        address: '5678 House Dr',
        city: 'Portland',
        state: 'Oregon',
        country: 'United States',
        lat: 250.3456789,
        lng: 120.3333333,
        name: 'Another temp house',
        description: 'A house',
        price: 290
      },
    ])
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Spots', {
      name: ['The Bay House', 'A temp house', 'Another temp house']
    })
  }
};
