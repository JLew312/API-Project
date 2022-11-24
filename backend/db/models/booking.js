'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(
        models.Spots,
        {foreignKey: 'spotId'}
      ),
      Booking.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      ),
      Booking.hasMany(
        models.SpotImage,
        {foreignKey: 'spotId'}
      ),
      Booking.hasMany(
        models.Review,
        {foreignKey: 'spotId'}
      )
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Booking'
  });
  return Booking;
};
