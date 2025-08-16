const { Employee, Address, Bank_Account, Role } = require('../models')
const bcrypt = require('bcryptjs');

const crypto = require('crypto')
const mail = require('../services/mail');
const { Op } = require('sequelize');



const createEmployee = async (req, res, next) => {
    try {

        console.log(req.body)
        const emp = await Employee.findOne({ where: { email: req.body.email } });

        if (emp) {
            return res.status(400).json({
                success: false,
                message: "Employee already exists",
            });
        } else {

            const { roleIds } = req.body

            //const dummyPassword = crypto.randomBytes(4).toString('hex');
            const dummyPassword = '12345';
            const hashedPassword = await bcrypt.hash(dummyPassword, 10);
            const newEmp = await Employee.create({
                ...req.body,
                password: hashedPassword,
                isTemp: true,
            }, {
                include: [
                    { model: Address, as: "address" },
                ],
            });

            const findedROles = await Role.findAll({
                where: {
                    id: { [Op.in]: roleIds }
                }
            })

            await newEmp.addRoles(findedROles)


            await mail.sendPasswordCreationEmail(newEmp.email, dummyPassword);

            return res.status(201).json({
                success: true,
                message: "Employee created successfully. A password creation email has been sent.",
                data: newEmp,
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Server error', });
    }

};

const editPassword = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        const { password } = req.body;

        const employee = await Employee.findOne(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        employee.password = hashedPassword;
        employee.isTemp = false;

        await employee.save();

        return res.status(200).json({
            success: true,
            message: "Password has been updated successfully.",
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', });
    }
};



const getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, {
            include: [
                { model: Address, as: 'address' },
                { model: Role, as: 'roles' },
                { model: Bank_Account, as: 'bank_accounts' }
            ]
        });

        if (employee) {
            res.status(200).json({
                success: true,
                data: employee
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', });
    }
}

const getAllEmployees = async (req, res, next) => {
    try {
        const { pageNo, pageSize } = req.query;
        
        let employees;
        if (pageNo && pageSize) {
            const page = parseInt(pageNo, 10);
            const limit = parseInt(pageSize, 10);
            const offset = (page - 1) * limit;

            employees = await Employee.findAll({
                include: [
                    { model: Address, as: 'address' },
                    { model: Role, as: 'roles' },
                    { model: Bank_Account, as: 'bank_accounts' }
                ],
                offset: offset,
                limit: limit,
            });

            // const totalCount = await Employee.count();
            const totalPages = Math.ceil(employees.length / limit);

            res.status(200).json({
                success: true,
                message: "Paginated employees data",
                data: employees,
                totalPages,
            });
        } else {
            employees = await Employee.findAll({
                include: [
                    { model: Address, as: 'address' },
                    { model: Role, as: 'roles' },
                    { model: Bank_Account, as: 'bank_accounts' }
                ],
            });

            res.status(200).json({
                success: true,
                message: "All employees data",
                data: employees,
                
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}





const editEmployee = async (req, res, next) => {
    try {
        console.log(req.body)
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        await Employee.update(req.body, {
            where: { id: req.params.id }
        });

        if (req.body.address) {
            const oldAddress=await Address.findOne({
                where:{
                    employee_id:req.params.id
                }
            })
            if(oldAddress){
                await oldAddress.update(req.body.address)
            }else{
                await Address.create({...req.body.address,employee_id:req.params.id});
            }
        }

        if (req.body.bank_accounts) {
            const oldBank=await Bank_Account.findOne({
                where:{
                    employee_id:req.params.id
                }
            })
            if(oldBank){
                await oldBank.update(req.body.abank_accounts)
            }else{
                await Bank_Account.create({...req.body.bank_accounts, employee_id:req.params.id});
            }

        }

        const updatedEmployee = await Employee.findByPk(req.params.id, {
            include: [
                { model: Address, as: 'address' },
                { model: Bank_Account, as: 'bank_accounts' }
            ]
        });

        return res.status(200).json({
            success: true,
            message: 'Update successful',
            data: updatedEmployee,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', });
    }
};

const updateEmployeeStatus =  async (req, res,next) => {
    try {
        console.log(req.body)

        const employee =  await Employee.findByPk(req.params.id);

        if(!employee){
            return res.status(404).json({ success: false, message: 'Employee not found'  
        })}
        
        const updatedEmployee = await Employee.update({status:req.body.status},{where: { id: req.params.id }});

        res.status(200).json({
            success: true,
            message: 'Update successful',
            data: updatedEmployee,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error', });
    }
}






const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.params.id,);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found', });
        }
        const deleteEmployee = await Employee.destroy({ where: { id: req.params.id } });

        return res.status(200).json({
            success: true,
            message: 'delete successful',
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', });
    }


};


// const uploadfile = async (req, res, next) => {
//     try {
//         res.status(200).json({ success: true, message: 'test', file: req.file })
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: 'Server error',
//         });
//     }
// };


/**
 * @swagger
 * /employee:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Employee already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /employee/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /employee:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of employees
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /employee/{id}:
 *   put:
 *     summary: Update employee details
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /employee/{id}/password:
 *   put:
 *     summary: Update employee password
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /employee/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /employee/{id}:
 *   patch:
 *     summary: Update employee status
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the employee to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the employee (e.g., active, inactive)
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

module.exports = {
    createEmployee, getEmployeeById,
    editPassword, editEmployee, deleteEmployee,
    getAllEmployees,updateEmployeeStatus,
};