'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsToMany(models.Venue, {
        through: models.Event,
        foreignKey: 'groupId',
        otherKey: 'venueId'
      })
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      })
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      })
      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId'
      })
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1,60]
      }
    },
    about: {
      type: DataTypes.STRING,
      validate: {
        len: [50, 250]
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['In person', 'Online']]
      },
      allowNull: false
    },
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
