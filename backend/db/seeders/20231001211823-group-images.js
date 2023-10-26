'use strict';

const { GroupImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://t2.gstatic.com/images?q=tbn:ANd9GcQBXYDl8cxip0vaBBwczT9gDHz3ebxIz_Fk0UYynfNEgv92fqr2',
        preview: true
      },
      {
        groupId: 1,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoflf9esjoHLCtf-h8d6MlXP_o4N2mJa1Thg&usqp=CAU',
        preview: false
      },
      {
        groupId: 2,
        url: 'https://curlytales.com/wp-content/uploads/2020/03/s2.jpg',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp95685AmYgbDpDpthS2uBiAmcgvGFD2341g&usqp=CAU',
        preview: true
      },
      {
        groupId: 3,
        url: 'group3pic3.com',
        preview: false
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
