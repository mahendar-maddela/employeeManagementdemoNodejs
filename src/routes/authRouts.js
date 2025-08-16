const express = require('express');

const { refreshTokenHandler } = require('../controller/refreshTokenCOntroller');
const { login, logout } = require('../controller/authController');
const{loginValidation} = require('../validations/authValidation')
const {validate} = require('../middlewares/validate')

const router = express.Router();

router.post('/',loginValidation,validate,login);
router.post('/logout', logout);

router.get("/refresh", refreshTokenHandler);


    
module.exports = router;