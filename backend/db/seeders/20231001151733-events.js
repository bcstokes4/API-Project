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
        startDate: "2023-11-19",
        endDate: "2023-11-19"
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Tennis Singles",
        description: 'Everybody come and play some singles, none of that pickleball jank',
        type: 'In person',
        capacity: 100,
        price: 0,
        startDate: "2023-12-19",
        endDate: "2023-12-19"
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Bi-annual Sleep Off",
        description: 'The sleeping league is having our semi-yearly sleep off. Make sure your pillows and blankets are regulation and you are only using approved sleep aids',
        type: 'In person',
        capacity: 100,
        price: 20,
        startDate: "2023-05-19",
        endDate: "2023-05-20"
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Rocket League Championships Play-in Tournament",
        description: 'Everyone is welcome to come try to knock off some of the best talent Rocket League has in all of North America!',
        type: 'In person',
        capacity: 200,
        price: 100,
        startDate: "2023-12-19",
        endDate: "2023-12-24"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
