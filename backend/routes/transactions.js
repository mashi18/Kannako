const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTransaction,
  getTransactions,
  getDashboardStats,
  syncTransactions,
} = require('../controllers/transactionController');

router.use(protect);

router.route('/')
  .post(createTransaction)
  .get(getTransactions);

router.post('/sync', syncTransactions);
router.get('/stats', getDashboardStats);

module.exports = router;
