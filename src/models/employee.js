'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      this.hasOne(models.Address, { foreignKey: "employee_id", as: "address" });
      this.hasOne(models.Bank_Account, { foreignKey: "employee_id", as: "bank_accounts" });

      this.belongsToMany(models.Task, { through: models.TaskAssignee, foreignKey: "empId", as:"tasks" });
      this.belongsToMany(models.Role, { through: models.Employee_Role, foreignKey: "empId", as: "roles" });
      this.belongsToMany(models.Project, { through: models.ProjectAssignee, foreignKey: "empId",as:"projects"});
      
    }
  }
  Employee.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    isTemp: DataTypes.TINYINT,
    status:{
      type:DataTypes.ENUM("Active","Inactive"),
      defaultValue:"Active"
    },
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};