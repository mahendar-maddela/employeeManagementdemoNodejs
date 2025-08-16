const { Task_type, Task } = require("../models/");

const createTaskType = async (req, res, next) => {
    try {
        // const empId = req.Employee.id;
        //const task = await Employee.findOne({ where: { name: req.body.name } });
        const newTaskType = await Task_type.create({
            name: req.body.name,
        });

        res.status(201).json({
            success: true,
            message: "TaskType created successfully",
            data: newTaskType,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const getAllTaskType = async (req, res, next) => {
    try {
        const taskTypes = await Task_type.findAll(
            //  {include:[{model : Task}]}
        );
        res.status(200).json({
            success: true,
            message: " All Task_Type data",
            data: taskTypes,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Server error', });
    }
}

const taskTypeview = async (req, res, next) => {
    try {
        const viewtaskType = await Task_type.findByPk(req.params.id);
        if (viewtaskType) {
            res.status(200).json({
                success: true,
                message: "Task_Type by id",
                data: viewtaskType,
            });
        } else {
            res.status(404).json({ success: false, message: 'not found Task_Type details', });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}

const taskTypeUpdate = async (req, res, next) => {
    try {
        //const empId = req.Employee.id;
        const taskType = await Task_type.findOne(req.body, {
            where: { id: req.params.id },
        });
        if (taskType) {
            const updatetask = Task_type.update(req.body)
            res.status(200).json({
                success: true,
                message: "Task_Type updated successfully",
                data: updatetask,
            });
        } else {
            res.status(404).json({
                success: false, message: 'Task_Type not found',
            });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', });
    }
}

const deleteTaskType = async (req, res, next) => {
    try {
        const taskType = await Task_type.findOne({
            where: { id: req.params.id, },
        });
        if (taskType) {
            await Task_type.destroy({
                where: { id: req.params.id },
            });
            res.status(200).json({ success: true, message: "Task_Type deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "requested Task_Type not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', });
    }
};
/**
 * @swagger
 * tags:
 *   name: TaskTypes
 *   description: Operations related to task types
 */

/**
 * @swagger
 * /task-type:
 *   post:
 *     summary: Create a new task type
 *     tags: [TaskTypes]
 *     requestBody:
 *       description: Task type details to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Development"
 *               status:
 *                 type: string
 *                 example: "Active"
 *     responses:
 *       201:
 *         description: Task type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "TaskType created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TaskType'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /task-type:
 *   get:
 *     summary: Retrieve all task types
 *     tags: [TaskTypes]
 *     responses:
 *       200:
 *         description: List of task types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "All Task_Type data"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaskType'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /task-type/{id}:
 *   get:
 *     summary: Retrieve a task type by ID
 *     tags: [TaskTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task type to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task_Type by id"
 *                 data:
 *                   $ref: '#/components/schemas/TaskType'
 *       404:
 *         description: Task type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "not found Task_Type details"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /task-type/{id}:
 *   put:
 *     summary: Update a task type by ID
 *     tags: [TaskTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task type to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated task type details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Development"
 *               status:
 *                 type: string
 *                 example: "Inactive"
 *     responses:
 *       200:
 *         description: Task type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task_Type updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TaskType'
 *       404:
 *         description: Task type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task_Type not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /task-type/{id}:
 *   delete:
 *     summary: Delete a task type by ID
 *     tags: [TaskTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task type to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task_Type deleted successfully"
 *       404:
 *         description: Task type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "requested Task_Type not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Development"
 *         status:
 *           type: string
 *           example: "Active"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-08-29T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-08-29T12:34:56.789Z"
 */


module.exports = { createTaskType, getAllTaskType, taskTypeview, taskTypeUpdate, deleteTaskType };