"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Task, {
        foreignKey: "mediable_id",
        as: "task",
        constraints: false,
      });
      this.belongsTo(models.Project, {
        foreignKey: "mediable_id",
        as: "project",
        constraints: false,
      });
    }
  }
  Media.init(
    {
      mediable_id: DataTypes.INTEGER,
      mediable_type: DataTypes.STRING,
      url: DataTypes.STRING,
      path: {
        type: DataTypes.STRING,
        get() {
          let baseUrl = "http://localhost:8080/";
          let url = this.getDataValue("url").split("/")[1] + "/";
          let fileName = this.getDataValue("file_name");
          if (url && fileName) {
            return baseUrl + url + fileName;
          }
        },
      },
      name: DataTypes.STRING,
      file_name: DataTypes.STRING,
      file_type: DataTypes.STRING,
      file_size: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Media",
    }
  );
  return Media;
};
