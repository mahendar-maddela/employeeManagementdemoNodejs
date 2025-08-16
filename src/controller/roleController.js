const { Op } = require('sequelize');
const { Role, Employee, Employee_Role, Permission} = require('../models');

const createRole = async (req, res, next) => {
    try {
        const NewRole = await Role.create(req.body);

        const { permission } = req.body
        console.log(permission,"permissions")

        const findedPermissions = await Permission.findAll({
            where: {
                id: { [Op.in]: permission }
            }
        });

        // const newPermissions = await Promise.all(findedPermissions.map(permission => permission.id));
        console.log(findedPermissions)
       await NewRole.addPermissions(findedPermissions);
       
        res.status(200).json({
            success: true,
            message: "role created",
            data: NewRole,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllRoles = async (req, res, next) => {
    try {
        const getall = await Role.findAll(
        //     { include: [
        //      {model: Permission , as:'permissions'},
        // //    { model: Employee }
        // ] }
        );
        res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: getall,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "server error" })
    }
}

const getByIdRole = async (req, res, next) => {
    try {
        const role = await Role.findByPk(req.params.id,
            { include: [
                {model: Permission , as:'permissions'}
                ] 
            }
        );
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" })
        }
        res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: role,
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "server error" })
    }
};

const updateRole = async (req, res, next) => {
    try {
        const role = await Role.findByPk(req.params.id);
        
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }

        await Role.update(req.body, { where: { id: req.params.id } });


        if (req.body.permissions) {
            const permissionsToRemove = await Permission.findAll({
                where: { id: req.body.permissions }
            });

            await role.removePermissions(permissionsToRemove);

            const foundPermissions = await Permission.findAll({
            
                where: {
                    id: { [Op.in]: req.body.permissions }
                }
            });

            await role.setPermissions(foundPermissions);
        }
 
        res.status(200).json({
            success: true,
            message: "Role updated successfully",
         
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" })
        }

        await Role.destroy({ where: { id: req.params.id } });
        res.status(200).json({
            success: true,
            message: "Role deleted successfully"
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "server error" })
    }
}


// Assign role to employee
const assignRole = async (req, res, next) => {
    try {
        const { roleId, empId } = req.body;

        const role = await Role.findByPk(roleId);
        const employee = await Employee.findByPk(empId);

        const existingRoleAssignment = await Employee_Role.findOne({
            where: { empId: employee.id, roleId: role.id }
        });

        if (existingRoleAssignment) {
            return res.status(409).json({ success: false, message: "Role already assigned to this employee", });
        }
        if (!employee) {
            return res.status(404).json({ success: false, message: "Invalid empId" });
        }
        if (!role) {
            return res.status(404).json({ success: false, message: "Invalid roleId" });
        }

        const roleAssignment = await employee.addRole(role);

        res.status(200).json({
            success: true,
            message: "Role added to requested employee successfully",
            data: roleAssignment,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const roleRemove = async (req, res, next) => {
    try {
        const { roleId, empId } = req.body;

        const role = await Role.findByPk(roleId);
        const employee = await Employee.findByPk(empId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "Invalid empId" });
        }
        if (!role) {
            return res.status(404).json({ success: false, message: "Invalid roleId" });
        }

        const removed = await employee.removeRole(role)

        if (removed) {
            res.status(200).json({
                success: true,
                message: "Role removed for employee successfully",

            });
        } else {
            res.status(404).json({ success: false, message: "Role not found for this employee", });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = { createRole, getAllRoles, getByIdRole, updateRole, deleteRole, assignRole, roleRemove }