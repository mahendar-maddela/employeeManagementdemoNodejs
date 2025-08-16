'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Task_type, { foreignKey: "task_type",  });
      this.belongsTo(models.Project, { foreignKey: "projectId", as: "project" });
      this.belongsTo(models.Client, { foreignKey: "clientId", as: "client" });
      this.belongsToMany(models.Employee, { through: models.TaskAssignee, foreignKey: "taskId", as:"employees"});
      this.hasMany(models.Media, {
        foreignKey: "mediable_id",
        constraints: false,
        scope: { mediable_type: "task", },
        as: "taskMedia",
      });
    }
  }
  Task.init({
    subject: DataTypes.STRING,
    description: DataTypes.STRING,
    task_type: DataTypes.INTEGER,
    clientId: { type: DataTypes.INTEGER, allowNull: true },
    projectId: { type: DataTypes.INTEGER, allowNull: true },
    endDate: DataTypes.DATE,
    status:{
      type:DataTypes.ENUM("Pending","Inprocess","Completed"),
      defaultValue:"Pending"
    },
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};