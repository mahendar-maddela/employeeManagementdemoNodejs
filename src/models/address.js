'use strict';
const {
  Model
} = require('sequelize');
const {countries} = require('../utils/enums')
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Employee, { foreignKey: "employee_id", as: "employee" });
    }
  }
  Address.init({
    address: DataTypes.STRING,
    postalcode: DataTypes.STRING,
    country: DataTypes.ENUM(countries),
    employee_id:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};