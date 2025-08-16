const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { createProjectType, getAllProjectTypes, projectTypebyId, projectTypeUpdate, deleteprojectType } = require('../controller/projectTypeController');
const { authorize } = require('../middlewares/authorize');
const router = express.Router();


router.post('/', createProjectType);
router.get('/',  getAllProjectTypes);
router.get('/:id', projectTypebyId);
router.put('/:id',  projectTypeUpdate);
router.delete('/:id', deleteprojectType);


module.exports = router; 