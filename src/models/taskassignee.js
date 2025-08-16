'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskAssignee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Task, { foreignKey: "taskId" });
      // this.belongsTo(models.Employee, { foreignKey: "empId" });
      
    }
  }
  TaskAssignee.init({
    taskId: DataTypes.INTEGER,
    empId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TaskAssignee',
  });
  return TaskAssignee;
};