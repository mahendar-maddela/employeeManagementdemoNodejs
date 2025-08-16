const express = require('express');
const { createEmployee, getEmployeeById, editPassword, uploadfile, editEmployee, deleteEmployee, getAllEmployees, updateEmployeeStatus, } = require('../controller/employeeController');
const authenticateToken = require('../middlewares/authenticateToken');
const { authorize } = require('../middlewares/authorize');
//const { ProjectImg } = require('../utils/multer');

const router = express.Router();

router.get('/:id', getEmployeeById);
router.get('/',  getAllEmployees);
router.post('/', createEmployee);
router.put('/:id',  editEmployee)
router.patch('/:id', updateEmployeeStatus)
router.delete('/:id',  deleteEmployee)

router.put('/update-password/:id', authenticateToken, editPassword);

//router.post('/upload', ProjectImg.single('image'), authenticateToken, uploadfile);

module.exports = router;
