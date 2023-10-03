'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Event.init({
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [5, 200]
      }
    },
    description: DataTypes.STRING,
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['In person', 'Online']]
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    startDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        dateCheck(date) {
          if(date < this.startDate) throw new Error('endDate cannot be before startDate')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
