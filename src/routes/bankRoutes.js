const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { createBank, getAllBanks, BankById, bankUpdate, deleteBank } = require('../controller/bankController');
const { authorize } = require('../middlewares/authorize');

const router = express.Router();

router.post('/', authenticateToken, authorize('createBank'), createBank);
router.get('/', authenticateToken, authorize('getAllBanks'), getAllBanks);
router.get('/:id', authenticateToken, authorize('BankById'), BankById);
router.put('/:id', authenticateToken, authorize('bankUpdate'), bankUpdate);
router.delete('/:id', authenticateToken, authorize('deleteBank'), deleteBank);

module.exports = router;
