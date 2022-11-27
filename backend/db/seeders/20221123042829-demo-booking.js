'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Bookings'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert(options,
    [
      {
        spotId: 2,
        userId: 1,
        startDate: '2022-01-25',
        endDate: '2022-2-01'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2022-01-25',
        endDate: '2022-02-01'
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '2022-01-25',
        endDate: '2022-02-01'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      startDate: '2022-01-25'
    })
  }
};
