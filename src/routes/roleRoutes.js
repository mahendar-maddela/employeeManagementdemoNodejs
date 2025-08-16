const express = require('express')
const authenticateToken = require('../middlewares/authenticateToken');
const { createRole, getAllRoles, getByIdRole, updateRole, deleteRole, assignRole, roleRemove } = require('../controller/roleController');
const { authorize } = require('../middlewares/authorize');


const router = express.Router();

router.post('/', createRole);
router.get('/', getAllRoles);
router.get('/:id',  getByIdRole);
router.put('/:id',  updateRole);
router.delete('/:id',  deleteRole);

router.post('/assign', assignRole);
router.post('/remove',roleRemove);



module.exports = router