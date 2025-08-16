const { Op } = require('sequelize');
const { Project, Project_type, Media, Employee, ProjectAssignee ,Client, sequelize} = require('../models');
const path = require('path')

const createProject = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const newProject = await Project.create({
            ...req.body,
        }, { transaction: t });

        if (req.files) {
            await Promise.all(req.files.map(file =>
                Media.create({
                    mediable_id: newProject.id,
                    mediable_type: "project",
                    url: file.destination,
                    path: file.path,
                    name: file.filename,
                    file_size: file.size,
                    file_name: file.filename,
                    file_type: file.mimetype,
                }, { transaction: t })
            ));
        }

        const empIds = JSON.parse(req.body.empIds);

        const findedEmployee = await Employee.findAll({
            where: {
                id: { [Op.in]: empIds }
            },
            transaction: t
        });

        await newProject.addEmployees(findedEmployee, { transaction: t }); 

        await t.commit();

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: { newProject },
        });

    } catch (err) {
        if (t) await t.rollback();
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
const getAllProjects = async (req, res, next) => {
    try {
        const { pageNo, pageSize } = req.query;

        let projects ;
        if (pageNo && pageSize) {
            const page = parseInt(pageNo, 10);
            const limit = parseInt(pageSize, 10);
            const offset = (page - 1) * limit;
    
             projects = await Project.findAll({
                include: [
                    { model: Media, as: "mediaProject" },
                    { model: Project_type, as: 'project_type' },
                    { model: Employee, as: "employees" },
                    { model: Client, as: 'client' },
                ]
            });
            const totalPages = Math.ceil(projects.length / limit);
            const paginatedProject = projects.slice(offset, offset + limit);
    
            res.status(200).json({
                success: true,
                message: " All project data",
                data: paginatedProject,
                totalPages,
            });
        }else{
            projects = await Project.findAll({
                include: [
                    { model: Client, as: 'client' },
                    // { model: Media, as: "mediaProject" },
                    // { model: Project_type, as: 'project_type' },
                    // { model: Employee, as: "employees" },
                
                ]
            });
            res.status(200).json({
                success: true,
                message: " All project data",
                data: projects
             })
            }

      
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', });
    }
}
const projectbyId = async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                { model: Media, as: "mediaProject" },
                { model: Employee, as: "employees" },
            ]
        });
        if (project) {
            res.status(200).json({
                success: true,
                message: "project view by id",
                data: project,
            });
        } else {
            res.status(404).json({ success: false, message: 'not found project details', });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', });
    }
}

const projectUpdate = async (req, res, next) => {
    try {

        const project = await Project.findOne({ where: { id: req.params.id } });

        if (project) {

            const projectUpdate = await Project.update(req.body, { where: { id: req.params.id } });

            if (req.file) {
                await Media.update(
                    {
                        url: req.file.destination,
                        name: req.file.filename,
                        file_size: req.file.size,
                        file_name: req.file.filename,
                        file_type: req.file.mimetype,
                    },
                    { where: { mediable_id: project.id, mediable_type: "project" } }
                );
            }

            res.status(200).json({
                success: true,
                message: "Project updated successfully",
                data: projectUpdate,
            });
        } else {
            res.status(404).json({ success: false, message: 'Project not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


const deleteproject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (project) {
            await Project.destroy({
                where: { id: req.params.id },
            });
            return res.status(200).json({ success: true, message: "project deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "requested project not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', });
    }
};

const updateProjectStatus =  async (req, res,next) => {
    try {
        console.log(req.body)
  
        const project =  await Project.findByPk(req.params.id);
  
        if(!project){
            return res.status(404).json({ success: false, message: 'project not found'  
        })}
        
        const updatedProject = await Project.update({status:req.body.status},{where: { id: req.params.id }});
  
        res.status(200).json({
            success: true,
            message: 'Project status updated successfully',
            data: updatedProject,
        })
  
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error', });
    }
  }

/**
 * @swagger
 * /project:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               empIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Project created successfully
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
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
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
 *         description: A list of projects
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties: true
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the project to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project details
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
 *         description: Project not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the project to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *         description: Project not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the project to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /project/{id}:
 *   patch:
 *     summary: Update project status
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the project to update the status
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
 *                 description: New status of the project
 *     responses:
 *       200:
 *         description: Project status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */



module.exports = { createProject, getAllProjects, deleteproject, projectUpdate, projectbyId, updateProjectStatus}