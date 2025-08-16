'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank_Account extends Model {
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
  Bank_Account.init({
    branch: DataTypes.STRING,
    ifscCode: DataTypes.STRING,
    accountHolderName: DataTypes.STRING,
    accountno: DataTypes.STRING,
    bankName:DataTypes.STRING,
    branchlocation: DataTypes.STRING,
    employee_id:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bank_Account',
  });
  return Bank_Account;
};