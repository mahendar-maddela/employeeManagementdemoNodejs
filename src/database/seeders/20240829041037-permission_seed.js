'use strict';
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { Employee, Permission, Role,Task_type } = require('../../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const first_name = process.env.FIRST_NAME
    const last_name = process.env.LAST_NAME
    const email = process.env.ADMIN_MAIL
    const password = process.env.ADMIN_PASS
    const phone = '966687124741364'

    const permissions = [
      { name: 'employeeCreate' },
      { name: 'employeeView' },
      { name: 'employeeEdit' },
      { name: 'employeeDelete' },
      { name: 'clientView' },
      { name: 'clientCreate' },
      { name: 'clientEdit' },
      { name: 'clientDelete' },
      { name: 'projectTypeView' },
      { name: 'projectTypeCreate' },
      { name: 'projectTypeEdit' },
      { name: 'projectTypeDelete' },
      { name: 'projectView' },
      { name: 'projectCreate' },
      { name: 'projectEdit' },
      { name: 'projectDelete' },
      { name: 'taskView' },
      { name: 'taskCreate' },
      { name: 'taskEdit' },
      { name: 'taskDelete' },
      { name: 'taskTypeView' },
      { name: 'taskTypeCreate' },
      { name: 'taskTypeEdit' },
      { name: 'taskTypeDelete' },
    ].map((Element) => ({
      ...Element,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const taskTypes = [
      { name: 'Client', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Internal', createdAt: new Date(), updatedAt: new Date() },
    ];
    

    const existingUser = await Employee.findOne({
      where: {
        email: process.env.ADMIN_MAIL,
      },
    });

    if (!existingUser) {

      const adminUser = await Employee.create({
        first_name,
        last_name,
        email,
        phone,
        password: await bcrypt.hash(password, 10),

        

      });
      const adminRole = await Role.create({ name: "Admin" });

      await adminUser.addRole(adminRole);

      const perms = await Permission.bulkCreate(permissions);

      await adminRole.addPermissions(perms);

      // Create task types only if they don't already exist
const existingTaskTypes = await Task_type.findAll({ attributes: ['name'] });
const existingTaskTypeNames = new Set(existingTaskTypes.map(tt => tt.name));

const newTaskTypes = taskTypes.filter(tt => !existingTaskTypeNames.has(tt.name));

if (newTaskTypes.length > 0) {
  await Task_type.bulkCreate(newTaskTypes);
  console.log('Task types seeded successfully.');
} else {
  console.log('All task types already exist.');
}


    } else {
      console.log(
        `User with email ${email} already exists. Skipping insertion.`
      );
    }


  },

  async down(queryInterface, Sequelize) {
  }
};
