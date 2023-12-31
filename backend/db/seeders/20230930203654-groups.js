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
        name: "Ace Racketeers",
        about: "Whether you're perfecting your backhand or aiming for aces, our group offers a friendly and supportive environment for you to enjoy the court. Let's rally together for the love of tennis!",
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
      },
      {
        organizerId: 3,
        name: "Evening Rocket League Group",
        about: "Every Friday night, we join a giant xbox live party chat and play some games together",
        type: "Online",
        private: true,
        city: "Ney York",
        state: "NY"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
