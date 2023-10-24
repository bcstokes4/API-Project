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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmBiXTHTMAHT5j2V0Y40bF1PoRXAR_quOy_g&usqp=CAU',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgRIL6CiA0L2dxlN8ePDYMgis9U5eB_RC4qZyR-VgHNdy02hBcFj5GIt04f4Bv06nAso&usqp=CAU',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjUh7I1Pct_IBF7JNbUeZMTe43AM-Rt6gbA&usqp=CAU',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRidrSwzLlfZ8UXgYBFZFqHyfVT3txVIQEZvQ&usqp=CAU',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGUK83Vrey8KIjgORkIgN8V3JLFfX52WObrg&usqp=CAU',
        preview: true
      },
      {
        eventId: 6,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdfxJuI8-ZawK8_GXmCghmRODEBev2tpldbQ&usqp=CAU',
        preview: true
      },
      {
        eventId: 7,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvHujGQ4Bb7TAqRvRoQaOa61fgtdFM1TCUCjsjYFwEh0618-9yfOvX0i5o6m6wq7MMqVY&usqp=CAU',
        preview: true
      },
      {
        eventId: 8,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJEPq5ufWlIha9f9y4RHPJjRdqm7SM0P_zQw&usqp=CAU',
        preview: true
      },
      {
        eventId: 9,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT31bkwkC8-s6G9lfGZf9vq3kHB7c8dqSLSLQ&usqp=CAU',
        preview: true
      },
      {
        eventId: 10,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi-efIwOWolr3XEGScsXtMvE0TycK6Td9TdQ&usqp=CAU',
        preview: true
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
