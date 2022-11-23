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

    await queryInterface.bulkDelete('ReviewsImages',
    [
      {
        reviewId: 3,
        url: "image url",
        preview: true
      },
      {
        reviewId: 1,
        url: "image url",
        preview: false
      },
      {
        reviewId: 2,
        url: "image url",
        preview: true
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

    await queryInterface.bulkDelete('ReviewsImages', {
      reviewId: [1, 2, 3]
    })
  }
};
