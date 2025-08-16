const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { createProject, getAllProjects, projectbyId, projectUpdate, deleteproject, updateProjectStatus } = require('../controller/projectController');
const { ProjectImg } = require('../utils/multer');
const { authorize } = require('../middlewares/authorize');
const router = express.Router();

router.post('/', ProjectImg.array('files'), createProject);
router.get('/',  getAllProjects);
router.get('/:id', authenticateToken, authorize('projectbyId'), projectbyId);
router.put('/:id', authenticateToken, authorize('projectUpdate'), projectUpdate);
router.delete('/:id', authenticateToken, authorize('deleteproject'), deleteproject);
router.patch('/:id', updateProjectStatus)

module.exports = router; 