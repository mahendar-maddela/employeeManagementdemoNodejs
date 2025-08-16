const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { createPermission, getAllPermissions, getByIdPermisssion, updatePermission, deletePermssion, assignPermission, removePermission } = require('../controller/permissionController');
const { authorize } = require('../middlewares/authorize');

const router = express.Router();

router.post('/', authenticateToken, authorize('createPermission'), createPermission);
router.get('/', getAllPermissions);
router.get('/:id', authenticateToken, authorize('getByIdPermisssion'), getByIdPermisssion);
router.put('/:id', authenticateToken, authorize('updatePermission'), updatePermission);
router.delete('/:id', authenticateToken, authorize('deletePermssion'), deletePermssion);

router.post('/assign', authenticateToken, authorize('assignPermission'), assignPermission);
router.post('/remove', authenticateToken, authorize('removePermission'), removePermission);


module.exports = router;