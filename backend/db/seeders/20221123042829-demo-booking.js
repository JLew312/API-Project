'use strict';

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

    await queryInterface.bulkInsert('Bookings',
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
    await queryInterface.bulkDelete('Bookings', {
      startDate: '2022-01-25'
    })
  }
};
