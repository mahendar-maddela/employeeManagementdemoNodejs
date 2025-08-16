const { Bank_Account, Employee } = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     Bank_Account:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         branch:
 *           type: string
 *         ifscCode:
 *           type: string
 *         name:
 *           type: string
 *         accountno:
 *           type: string
 *         branchlocation:
 *           type: string
 *         employee_id:
 *           type: integer
 *         employee:
 *           $ref: '#/components/schemas/Employee'
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 */

/**
 * @swagger
 * /banks:
 *   post:
 *     summary: Create a new bank account
 *     tags:
 *       - Bank Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bank_Account'
 *     responses:
 *       201:
 *         description: Bank created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank_Account'
 *       500:
 *         description: Server error
 */
const createBank = async (req, res, next) => {
  try {

    const newBank = await Bank_Account.create(
      {
        branch: req.body.branch,
        ifscCode: req.body.ifscCode,
        name: req.body.name,
        accountno: req.body.accountno,
        branchlocation: req.body.branchlocation,
        employee_id: req.body.employee_id
      }
    );
    res.status(201).json({
      success: true,
      message: "Bank created successfully",
      data: newBank,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error', });
  }
}

/**
 * @swagger
 * /banks:
 *   get:
 *     summary: Get all bank accounts
 *     description: Retrieves all bank accounts along with their associated employees.
 *     tags:
 *       - Bank Accounts
 *     responses:
 *       200:
 *         description: A list of all bank accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bank_Account'
 *       500:
 *         description: Server error
 */

const getAllBanks = async (req, res, next) => {
  try {
    const clients = await Bank_Account.findAll(
      { include: [{ model: Employee, as: 'employee' }] }
    );
    res.status(200).json({
      success: true,
      message: " All Banks data",
      data: clients,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', });
  }
}

/**
 * @swagger
 * /banks/{id}:
 *   get:
 *     summary: Get a bank account by ID
 *     tags:
 *       - Bank Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the bank account to retrieve
 *     responses:
 *       200:
 *         description: Bank account retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank_Account'
 *       404:
 *         description: Bank account not found
 *       500:
 *         description: Server error
 */
const BankById = async (req, res, next) => {
  try {
    const bank = await Bank_Account.findByPk(req.params.id,
      { include: [{ model: Employee, as: 'employee' }] }
    );
    if (bank) {
      res.status(200).json({
        success: true,
        message: "bank view by id",
        data: bank,
      });
    } else {
      res.status(404).json({ success: false, message: 'not found bank details', });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Server error', });
  }
}

/**
 * @swagger
 * /banks/{id}:
 *   put:
 *     summary: Update a bank account
 *     tags:
 *       - Bank Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the bank account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bank_Account'
 *     responses:
 *       200:
 *         description: Bank account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank_Account'
 *       404:
 *         description: Bank account not found
 *       500:
 *         description: Server error
 */
const bankUpdate = async (req, res, next) => {
  try {
    // const empId = req.Employee.id;
    const bank = await Bank_Account.findOne(req.body, {
      where: { id: req.params.id },
    });

    if (bank) {
      const bankUpdate = Bank_Account.update(req.body)
      res.status(200).json({
        success: true,
        message: "bank updated successfully",
        data: bankUpdate,
      });
    } else {
      res.status(404).json({ success: false, message: 'bank  not found', });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', });
  }
}

/**
 * @swagger
 * /banks/{id}:
 *   delete:
 *     summary: Delete a bank account
 *     tags:
 *       - Bank Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the bank account to delete
 *     responses:
 *       200:
 *         description: Bank account deleted successfully
 *       404:
 *         description: Bank account not found
 *       500:
 *         description: Server error
 */
const deleteBank = async (req, res, next) => {
  try {
    const bank = await Bank_Account.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (bank) {
      await Bank_Account.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json({ success: true, message: "client deleted successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "requested client not found" });
    }
  } catch (error) {
    next(error);
  }
};


module.exports = { createBank, deleteBank, getAllBanks, BankById, bankUpdate }