const express = require('express');
const { totalCount } = require('../controller/dashboardController')


const router = express.Router();

router.get('/',totalCount)

module.exports = router;