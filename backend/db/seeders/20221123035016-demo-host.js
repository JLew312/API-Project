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

    await queryInterface.bulkInsert('Hosts',
    [
      {
        firstName: 'Zap',
        lastName: 'Brannigan',
        phoneNum: 1111111111,
        email: 'branniganz@futuramamail.com',
        rating: 2.4,
        spotId: 2
      },
      {
        firstName: 'Hubert',
        lastName: 'Farnsworth',
        phoneNum: 1212121212,
        email: 'farnsworthh@futuramamail.com',
        rating: 3.57,
        spotId: 3
      },
      {
        firstName: 'Turanga',
        lastName: 'Leela',
        phoneNum: 1313131313,
        email: 'leelat@futuramamail.com',
        rating: 4.0,
        spotId: 1
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     await queryInterface.bulkDelete('Hosts', {
      firstName: ['Zap', 'Hubert', 'Turanga']
    })
  }
};
