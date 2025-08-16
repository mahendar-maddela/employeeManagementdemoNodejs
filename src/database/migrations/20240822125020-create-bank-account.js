'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bank_Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch: {
        type: Sequelize.STRING
      },
      ifscCode: {
        type: Sequelize.STRING
      },
      accountHolderName: {
        type: Sequelize.STRING
      },
      accountno: {
        type: Sequelize.STRING
      },
      bankName:{
        type: Sequelize.STRING
      },
      branchlocation: {
        type: Sequelize.STRING
      },
      employee_id:{
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bank_Accounts');
  }
};