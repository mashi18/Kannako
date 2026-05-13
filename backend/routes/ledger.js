const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createLedger,
  getLedgers,
  getLedgerById,
  updateLedger,
  deleteLedger,
} = require('../controllers/ledgerController');

router.use(protect);

router.route('/')
  .post(createLedger)
  .get(getLedgers);

router.route('/:id')
  .get(getLedgerById)
  .put(updateLedger)
  .delete(deleteLedger);

module.exports = router;
