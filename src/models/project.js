'use strict';
const { assign } = require('nodemailer/lib/shared');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Client, { foreignKey: "clientId", as: "client" });
      this.belongsTo(models.Project_type, { foreignKey: "project_typeId", as: "project_type" });

      this.hasMany(models.Task, { foreignKey: "projectId", as: "tasks" });
      this.belongsToMany(models.Employee, { through: models.ProjectAssignee, as: 'employees', foreignKey: 'projectId' });

      this.hasMany(models.Media, {
        foreignKey: "mediable_id",
        constraints: false,
        scope: { mediable_type: "project", },
        as: "mediaProject",
      });

    }
  }
  Project.init({
    project_name: DataTypes.STRING,
    clientId: DataTypes.INTEGER,
    project_typeId: DataTypes.INTEGER,
    endDate:DataTypes.DATE,
    status:{
      type:DataTypes.ENUM("Pending","Published","Inprocess","Completed"),
      defaultValue:"Pending"
    },

  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};