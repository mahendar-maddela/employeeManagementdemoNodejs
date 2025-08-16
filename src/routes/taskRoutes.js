const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken')
const { createTask, getAllTask, taskUpdate, deleteTask, taskview, assignTask, removeTask, updateTaskStatus, downloadFile, } = require('../controller/TaskController');
const { TaskImg } = require('../utils/multer');
const { authorize } = require('../middlewares/authorize');
const router = express.Router();

router.post('/', TaskImg.array('files'),createTask);
router.get('/',  getAllTask);
router.get('/:id', taskview)
router.put('/:id', authenticateToken, authorize('taskUpdate'), taskUpdate);
router.delete('/:id', authenticateToken, authorize('deleteTask'), deleteTask);
router.patch('/:id', updateTaskStatus)
router.get('/file/:id', downloadFile)

router.post('/assign', authenticateToken, authorize('assignTask'), assignTask)
router.post('/remove', authenticateToken, authorize('removeTask'), removeTask)


module.exports = router;