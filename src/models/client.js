'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     this.hasMany(models.Project, { foreignKey: "clientId", as: "projects" });
    }
  }
  Client.init({ 
    name: DataTypes.STRING,
    number: DataTypes.STRING,
    email: DataTypes.STRING,
    note: DataTypes.STRING,
   company_Name:DataTypes.STRING, 
   status: {
    type:DataTypes.ENUM("Active","Inactive"),
    defaultValue:"Active"
  },
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};