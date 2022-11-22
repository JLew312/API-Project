'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Host extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Host.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.NUMERIC(3,2),
      allowNull: false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Host',
  });
  return Host;
};
