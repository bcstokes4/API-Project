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
        startDate: "2022-11-19 24:00:00",
        endDate: "2022-11-20 19:30:00"
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Tennis Singles",
        description: 'Everybody come and play some singles, none of that pickleball stuff.',
        type: 'In person',
        capacity: 100,
        price: 0,
        startDate: "2023-12-19 12:00:00",
        endDate: "2023-12-19 18:00:00"
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Tennis Tournament",
        description: "Join our thrilling tennis tournament and showcase your skills on the court. Compete with fellow tennis enthusiasts in a fun-filled event that promises exciting matches, friendly rivalry, and a chance to prove your prowess in the game.",
        type: 'In person',
        capacity: 50,
        price: 0,
        startDate: "2023-08-19 09:30:00",
        endDate: "2023-08-20 18:00:00"
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Midnight Madness Tennis Bash',
        description: "Join our tennis group for a unique nighttime tournament under the stars. With glow-in-the-dark tennis balls and court lights, you'll enjoy a one-of-a-kind tennis experience while socializing with fellow players.",
        type: 'In person',
        capacity: 50,
        price: 0,
        startDate: "2023-12-19 20:30:00",
        endDate: "2023-12-20 23:00:00"
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Bi-annual Sleep Off",
        description: 'The sleeping league is having our semi-yearly sleep off. Make sure your pillows and blankets are regulation and you are only using approved sleep aids',
        type: 'In person',
        capacity: 100,
        price: 20,
        startDate: "2023-05-19 17:30:00",
        endDate: "2023-05-20 09:00:00"
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Dreamy Slumber Soirée'",
        description: "Join us for an evening of relaxation and sleep-enhancing activities. From soothing bedtime stories to guided meditation, we'll help you unwind and improve your sleep quality. Don't miss out on this rejuvenating event that promises a night of sweet dreams.",
        type: 'In person',
        capacity: 30,
        price: 5,
        startDate: "2024-05-19 18:30:00",
        endDate: "2024-05-20 08:30:00"
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Night Owl's Delight",
        description: "Join us for an educational stargazing and nocturnal wildlife adventure. We'll explore the night sky, enjoy a serene campfire, and listen to the soothing sounds of nature.",
        type: 'In person',
        capacity: 30,
        price: 5,
        startDate: "2024-05-19 18:30:00",
        endDate: "2024-05-20 10:30:00"
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Rocket League Championships Play-in Tournament",
        description: 'Everyone is welcome to come try to knock off some of the best talent Rocket League has in all of North America!',
        type: 'In person',
        capacity: 200,
        price: 100,
        startDate: "2023-02-19 20:30:00",
        endDate: "2023-02-24 08:30:00"
      },
      {
        venueId: null,
        groupId: 3,
        name: "Rocket League Rumble",
        description: "Join our Rocket League group for an adrenaline-pumping tournament that combines soccer and rocket-powered cars. Test your teamwork, strategy, and precision on the virtual pitch as you compete for glory. It's a high-octane showdown you won't want to miss!",
        type: 'Online',
        capacity: 200,
        price: 10,
        startDate: "2023-12-19 21:30:00",
        endDate: "2023-12-22 12:00:00"
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Boost Battle Extravaganza",
        description: ' Show off your aerial skills and incredible saves in a thrilling freestyle competition. Join us for a night of epic goals, jaw-dropping plays, and nail-biting matches. Unleash your rocket-powered cars and go for gold in this high-flying event!',
        type: 'In person',
        capacity: 200,
        price: 5,
        startDate: "2024-02-19 18:00:00",
        endDate: "2024-02-19 24:00:00"
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
