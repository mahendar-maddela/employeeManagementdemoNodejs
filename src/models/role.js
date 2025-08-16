'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Permission, { through: models.RolePermission, foreignKey: "roleId", as:"permissions"});
      this.belongsToMany(models.Employee, { through: models.Employee_Role, foreignKey: "roleId" });

    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: true 
      }
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};