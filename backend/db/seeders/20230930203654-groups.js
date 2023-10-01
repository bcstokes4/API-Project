'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Evening Tennis on the Water",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In person",
        private: true,
        city: "New York",
        state: "NY"
      },
      {
        organizerId: 2,
        name: "Competitive Sleeping League",
        about: "Bring your pillows, folks. Each week, we take 50,000 pillows into Time Square, build a fort and sleep inside of it for 5 days straight",
        type: "In person",
        private: true,
        city: "New York",
        state: "NY"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 100] }
    }, {});
  }
};
