
const { RolePermission, Permission, Role } = require('../models');
const permission = require('../models/permission');


const createPermission = async (req, res, next) => {

    try {
        const permission = await Permission.create(req.body);
        res.status(201).json({
            success: true,
            message: "Permission created successfully ",
            data: permission,
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "server error" })
    }
};

const getAllPermissions = async (req, res, next) => {

    try {
        const allPermissions = await Permission.findAll({
            include: [{ model: Role }]
        });
        res.status(200).json({
            success: true,
            message: "Permission fetched successfully",
            data: allPermissions
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }

}

const getByIdPermisssion = async (req, res, next) => {
    try {
        const permission = await Permission.findByPk(req.params.id);
        if (!permission) {
            return res.status(404).json({ success: false, message: "Permission not found" })
        }
        res.status(200).json({
            success: true,
            message: "Permission fetched successfully",
            data: permission
        })

    } catch (err) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

const updatePermission = async (req, res, next) => {
    try {
        const permission = await Permission.findByPk(req.params.id);
        if (!permission) {
            return res.status(404).json({ success: false, message: "Permission not found" })
        }
        const updatePerm = await Permission.update(req.body, { where: { id: req.params.id } });
        res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: updatePerm
        })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

const deletePermssion = async (req, res, next) => {
    try {
        const per = await Permission.findByPk(req.params.id);
        if (!per) {
            return res.status(404).json({ success: false, message: "Permission not found" })
        }

        await Permission.destroy({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Permission deleted successfully" })

    } catch (err) {
        res.status(500).json({ success: false, message: "server error" })
    }
};

// Assign permission to role
const assignPermission = async (req, res, next) => {
    try {
        const { roleId, permissionId } = req.body;

        const role = await Role.findByPk(roleId);
        const permission = await Permission.findByPk(permissionId);

        const exists = await RolePermission.findOne({ where: { roleId, permissionId } });

        if (exists) {
            return res.status(409).json({ success: false, message: "Permission already assigned to requested role" });
        }

        if (!role) {
            return res.status(404).json({ success: false, message: "Invalid roleId " });
        }
        if (!permission) {
            return res.status(404).json({ success: false, message: "Invalid permissionId" });
        }

        const perm = await role.addPermission(permission)

        res.status(200).json({
            success: true,
            message: "Permission added to role successfully",
            data: perm,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Remove permission from role
const removePermission = async (req, res, next) => {
    try {
        const { roleId, permissionId } = req.body;

        const role = await Role.findByPk(roleId);
        const permission = await Permission.findByPk(permissionId);

        if (!permission) {
            return res.status(404).json({ success: false, message: "Invalid permissionId" });
        }
        if (!role) {
            return res.status(404).json({ success: false, message: "Invalid roleId" });
        }


        const removed = await role.removePermission(permission);

        if (removed) {
            res.status(200).json({
                success: true,
                message: "Permission removed for role successfully",

            });
        } else {
            res.status(404).json({ success: false, message: "Permission not found for this role", });
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Role'
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags:
 *       - Permissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: A list of all permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the permission to retrieve
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission by ID
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the permission to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /permissions/assign:
 *   post:
 *     summary: Assign a permission to a role
 *     tags:
 *       - Permissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *               permissionId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Permission added to role successfully
 *       404:
 *         description: Invalid roleId or permissionId
 *       409:
 *         description: Permission already assigned to the role
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /permissions/remove:
 *   post:
 *     summary: Remove a permission from a role
 *     tags:
 *       - Permissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *               permissionId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Permission removed from role successfully
 *       404:
 *         description: Invalid roleId or permissionId
 *       500:
 *         description: Server error
 */
module.exports = {
    createPermission, getAllPermissions,
    getByIdPermisssion, updatePermission,
    deletePermssion, assignPermission, removePermission
}