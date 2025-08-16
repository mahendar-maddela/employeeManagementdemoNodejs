const { Project, Project_type, Employee } = require('../models');

const createProjectType = async (req, res, next) => {
    try {
        // const empId = req.Employee.id;
        //const project = await Employee.findOne({ where: { name: req.body.name } });
          console.log(req.body)
        const newProjectType = await Project_type.create({
            // name: req.body.name,
            // status: req.body.status,
            ...req.body
        });

        res.status(201).json({
            success: true,
            message: "project_type created successfully",
            data: newProjectType,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
const getAllProjectTypes = async (req, res, next) => {
    try {
        const projectTypes = await Project_type.findAll(
            //{ include: [{ model: Project, as: 'project' }] }
        );
        res.status(200).json({
            success: true,
            message: " All project_types data",
            data: projectTypes,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}
const projectTypebyId = async (req, res, next) => {
    try {
        const project_type = await Project_type.findByPk(req.params.id);
        if (project_type) {
            res.status(200).json({
                success: true,
                message: "project_type view by id",
                data: project_type,
            });
        } else {
            res.status(404).json({ success: false, message: 'not found project details', });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}

const projectTypeUpdate = async (req, res, next) => {
    try {
        // const empId = req.Employee.id;
        const projectType = await Project_type.findOne(req.body, {
            where: { id: req.params.id },
        });

        if (projectType) {
            const projectTypeUpdate = Project_type.update(req.body, { where: { id: req.params.id } })
            res.status(200).json({
                success: true,
                message: "project_type updated successfully",
                data: projectTypeUpdate,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'project_type  not found',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}

const deleteprojectType = async (req, res, next) => {
    try {
        console.log(req.body    )
        const projectType = await Project_type.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (projectType) {
            await Project_type.destroy({
                where: { id: req.params.id },
            });
            return res.status(200).json({ success: true, message: "project_type deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "requested project_type not found" });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Server error', });
    }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /project-types:
 *   post:
 *     summary: Create a new project type
 *     tags:
 *       - ProjectTypes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectType'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project-types:
 *   get:
 *     summary: Get all project types
 *     tags:
 *       - ProjectTypes
 *     responses:
 *       200:
 *         description: List of project types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectType'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project-types/{id}:
 *   get:
 *     summary: Get a project type by ID
 *     tags:
 *       - ProjectTypes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the project type to retrieve
 *     responses:
 *       200:
 *         description: Project type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectType'
 *       404:
 *         description: Project type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project-types/{id}:
 *   put:
 *     summary: Update a project type by ID
 *     tags:
 *       - ProjectTypes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the project type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectType'
 *       404:
 *         description: Project type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project-types/{id}:
 *   delete:
 *     summary: Delete a project type by ID
 *     tags:
 *       - ProjectTypes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the project type to delete
 *     responses:
 *       200:
 *         description: Project type deleted successfully
 *       404:
 *         description: Project type not found
 *       500:
 *         description: Server error
 */

module.exports = { createProjectType, getAllProjectTypes, projectTypebyId, projectTypeUpdate, deleteprojectType }   