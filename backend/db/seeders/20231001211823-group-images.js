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
        url: 'group1pic1.com',
        preview: true
      },
      {
        groupId: 1,
        url: 'group1pic2.com',
        preview: false
      },
      {
        groupId: 2,
        url: 'group2pic1.com',
        preview: true
      },
      {
        groupId: 3,
        url: 'group3pic1.com',
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
