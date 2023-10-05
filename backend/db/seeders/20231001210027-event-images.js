'use strict';

const { EventImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'eventimg1A.com',
        preview: true
      },
      {
        eventId: 1,
        url: 'eventimg1B.com',
        preview: false
      },
      {
        eventId: 2,
        url: 'eventimg2A.com',
        preview: true
      },
      {
        eventId: 2,
        url: 'eventimg2B.com',
        preview: false
      },
      {
        eventId: 3,
        url: 'eventimg3A.com',
        preview: true
      },
      {
        eventId: 3,
        url: 'eventimg3B.com',
        preview: false
      },
      {
        eventId: 4,
        url: 'eventimg4A.com',
        preview: true
      },
      {
        eventId: 4,
        url: 'eventimg4B.com',
        preview: false
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [true, false] }
    }, {});
  }
};
