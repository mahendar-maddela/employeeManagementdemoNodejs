const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken')

const { authorize } = require('../middlewares/authorize')
const router = express.Router();

const { createClient, getAllClients, clientID, clientUpdate, deleteClient } = require('../controller/clientController');

router.post('/',createClient);
router.get('/', getAllClients);
router.get('/:id', clientID);
router.put('/:id', authenticateToken, authorize("clientUpdate"), clientUpdate);
router.delete('/:id', authenticateToken, authorize("deleteClient"), deleteClient);

module.exports = router;