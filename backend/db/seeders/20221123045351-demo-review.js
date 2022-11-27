'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Reviews'

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
        userId: 1,
        spotId: 3,
        review: 'a review',
        stars: 2
      },
      {
        userId: 2,
        spotId: 2,
        review: 'a review',
        stars: 3
      },
      {
        userId: 3,
        spotId: 1,
        review: 'a review',
        stars: 5
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
      id: [1 , 2, 3]
    })
  }
};
