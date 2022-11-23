'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'ben',
        lastName: 'mason',
        phoneNum: 5289610059,
        email: 'demo@user.io',
        username: 'Demo-lition',
        avgRating: 4.0,
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'hal',
        lastName: 'mason',
        phoneNum: 2534856713,
        email: 'user1@user.io',
        username: 'FakeUser1',
        avgRating: 2.7,
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'matt',
        lastName: 'mason',
        phoneNum: 2056783456,
        email: 'user2@user.io',
        username: 'FakeUser2',
        avgRating: 3.5,
        hashedPassword: bcrypt.hashSync('password3')
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
