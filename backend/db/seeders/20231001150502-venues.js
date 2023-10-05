'use strict';

const { Venue } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: "123 Disney Lane",
        city: "New York",
        state: "NY",
        lat: 37.7645358,
        lng: -122.4730327
      },
      {
        groupId: 2,
        address: "456 Banana Boulevard",
        city: "New York",
        state: "NY",
        lat: 37.7645358,
        lng: -122.4730327
      },
      {
        groupId: 3,
        address: "789 Legume Lane",
        city: "New York",
        state: "NY",
        lat: 37.7645358,
        lng: -122.4730327
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
