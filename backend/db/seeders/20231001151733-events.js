'use strict';

const { Event } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: null,
        groupId: 1,
        name: "Tennis Group First Meet and Greet",
        description: 'Great chance to meet everyone in the group!',
        type: 'Online',
        capacity: 100,
        price: 0,
        startDate: "2021-11-19",
        endDate: "2021-11-19"
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Tennis Singles",
        description: 'Everybody come and play some singles, none of that pickleball jank',
        type: 'In person',
        capacity: 100,
        price: 0,
        startDate: "2021-12-19",
        endDate: "2021-12-20"
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Pickleball Singles",
        description: 'Everybody come and play some singles, none of that tennis jank',
        type: 'In person',
        capacity: 100,
        price: 0,
        startDate: "2021-12-19",
        endDate: "2021-12-20"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1] }
    }, {});
  }
};
