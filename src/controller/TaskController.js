const { Op } = require("sequelize");
const {
  Task,
  Media,
  Employee,
  TaskAssignee,
  Task_type,
  Project,
  Client,
} = require("../models");
const path = require("path");

const createTask = async (req, res, next) => {
  console.log(req.body);
  try {
    const newTask = await Task.create({ ...req.body });
    if (req.files) {
      await Promise.all(
        req.files.map((file) =>
          Media.create({
            mediable_id: newTask.id,
            mediable_type: "task",
            url: file.destination,
            path: file.path,
            name: file.filename,
            file_size: file.size,
            file_name: file.filename,
            file_type: file.mimetype,
          })
        )
      );
    }

    let empIds = req.body.empId;
    empIds = JSON.parse(empIds);
    const findedEmployee = await Employee.findAll({
      where: {
        id: { [Op.in]: empIds },
      },
    });
    console.log(findedEmployee);
    findedEmployee.map(async (item) => {
      await TaskAssignee.create({ taskId: newTask.id, empId: item.id });
    });
    // await newTask.addEmployees(findedEmployee);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { newTask },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllTask = async (req, res, next) => {
  try {
    const { pageNo, pageSize } = req.query;
    let tasks;
    if (pageNo && pageSize) {
      const page = parseInt(pageNo, 10) || 1;
      const limit = parseInt(pageSize, 10);
      const offset = (page - 1) * limit;
      const taskCount = await Task.count();
      tasks = await Task.findAll({
        include: [
          { model: Media, as: "taskMedia" },
          { model: Employee, as: "employees" },
          { model: Project, as: "project" },
          { model: Client, as: "client" },
          //{model: Task_type}
        ],
        offset: offset,
        limit: limit,
        order: [["id", "desc"]],
      });

      const totalPages = Math.ceil(taskCount / limit);

      res.status(200).json({
        success: true,
        message: " All Task data",
        data: tasks,
        totalPages,
      });
    } else {
      tasks = await Task.findAll({
        include: [
          { model: Media, as: "taskMedia" },
          { model: Employee, as: "employees" },
          { model: Project, as: "project" },
          { model: Client, as: "client" },
          //{model: Task_type}
        ],
      });
      res
        .status(200)
        .json({ success: true, message: " All Task data", data: tasks });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const file = await Media.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    res.download(path.join(__dirname, "./../../uploads", file.url.split("/")[1], file.file_name),
      file.file_name,
      (err) => {
        if (err) {
          res.status(400).json({
            error: err,
            msg: "Problem downloading the file",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const taskview = async (req, res, next) => {
  try {
    const viewtask = await Task.findByPk(req.params.id, {
      include: [
        { model: Media, as: "taskMedia" },
        { model: Employee, as: "employees" },
        { model: Project, as: "project" },
        { model: Client, as: "client" },
      ],
    });
    if (viewtask) {
      res.status(200).json({
        success: true,
        message: "taskview by id",
        data: viewtask,
      });
    } else {
      res.status(404).json({success: false,message: "not found task details",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", });
  }
};

const taskUpdate = async (req, res, next) => {
  try {
    //const empId = req.Employee.id;
    const task = await Task.findOne(req.body, {
      where: { id: req.params.id },
    });

    if (task) {
      const updatetask = Task.update(req.body, {
        where: { id: req.params.id },
      });
      if (req.file) {
        await Media.update(
          {
            url: req.file.destination,
            name: req.file.filename,
            file_size: req.file.size,
            file_name: req.file.filename,
            file_type: req.file.mimetype,
          },
          { where: { mediable_id: Task.id, mediable_type: "task" } }
        );
      }
      res.status(200).json({
        success: true,
        message: "task updated successfully",
        data: updatetask,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "task not found",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", });
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (task) {
      await Task.destroy({ where: { id: req.params.id } });
      res
        .status(200)
        .json({ success: true, message: "task deleted successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "requested task not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    console.log(req.body);

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "task not found" });
    }

    const updatedTask = await Task.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: "task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//Task assign to employee
const assignTask = async (req, res, next) => {
  try {
    const { taskId, empId } = req.body;

    const task = await Task.findByPk(taskId);
    const employee = await Employee.findByPk(empId);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Invalid empId" });
    }
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid taskId" });
    }

    const existingTaskAssignment = await TaskAssignee.findOne({
      where: { empId: employee.id, taskId: task.id },
    });

    if (existingTaskAssignment) {
      return res.status(409).json({
        success: false,
        message: "Task already assigned to this employee",
      });
    }

    const taskAssignment = await TaskAssignee.create({
      empId: employee.id,
      taskId: task.id,
    });

    res.status(200).json({
      success: true,
      message: "Task assigned to employee successfully",
      data: taskAssignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove task from employee
const removeTask = async (req, res, next) => {
  try {
    const { taskId, empId } = req.body;

    const existtask = await TaskAssignee.findOne({ where: { taskId, empId } });

    if (!existtask) {
      return res.status(404).json({
        success: false,
        message: "task not assigned to this employee",
      });
    }

    await TaskAssignee.destroy({
      where: { taskId, empId },
    });

    res.status(200).json({
      success: true,
      message: "Task removed from Employee successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               empId:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Task created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
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
 *         description: All Task data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /task/assign:
 *   post:
 *     summary: Assign a task to an employee
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *               empId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       404:
 *         description: Task or employee not found
 *       409:
 *         description: Task already assigned to this employee
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /task/remove:
 *   post:
 *     summary: Remove a task from an employee
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *               empId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Task removed from employee successfully
 *       404:
 *         description: Task not assigned to this employee
 *       500:
 *         description: Server error
 */

module.exports = {
  createTask,
  getAllTask,
  taskUpdate,
  deleteTask,
  taskview,
  assignTask,
  removeTask,
  updateTaskStatus,
  downloadFile,
};
