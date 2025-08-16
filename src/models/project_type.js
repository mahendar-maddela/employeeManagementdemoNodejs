'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Project , {foreignKey: "project_typeId", as: "project"})

    }
  }
  Project_type.init({
    name: DataTypes.STRING,
    status:{
      type:DataTypes.ENUM("Active","Inactive"),
      defaultValue:"Active"
    },
  }, {
    sequelize,
    modelName: 'Project_type',
    paranoid:true,
  });
  return Project_type;
};  