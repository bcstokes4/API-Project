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
        url: 'https://64.media.tumblr.com/bc93f88fc6fa5d3b0a6590c7c1a8a75f/b185e2807242f3cf-27/s640x960/85935da9755b074b99cf29d9473574a56379790d.jpg',
        preview: true
      },
      {
        groupId: 1,
        url: 'https://64.media.tumblr.com/5175344035942c7d3e3944eafbb3ffcb/fdaaa89f914a5dfa-52/s640x960/38612de885d26550c5068825f881d122ef21ff63.jpg',
        preview: false
      },
      {
        groupId: 2,
        url: 'https://media.istockphoto.com/id/1366345239/vector/healthy-sleep-concept-beautiful-woman-sleeping-happily-on-bed-at-night-time-vector.jpg?s=612x612&w=0&k=20&c=gy8uleSks_RxlCKPLksCUdxZcrMxyC5nhcz1VhTOaqE=',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://64.media.tumblr.com/3835ae87038a8f4088ada7f809d385cf/a9b42fbf0789ac21-9d/s640x960/c7227f38df8ef34585c5c8ea96903189aa4c5db1.pnj',
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
