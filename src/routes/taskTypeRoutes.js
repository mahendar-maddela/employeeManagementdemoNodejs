const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { createTaskType, getAllTaskType, taskTypeview, taskTypeUpdate, deleteTaskType } = require('../controller/taskTypeController');
const { authorize } = require('../middlewares/authorize');
const router = express.Router();

router.post('/',  createTaskType);
router.get('/',  getAllTaskType);
router.get('/:id', taskTypeview)
router.put('/:id', authenticateToken, authorize('taskTypeUpdate'), taskTypeUpdate);
router.delete('/:id',  deleteTaskType);

module.exports = router;