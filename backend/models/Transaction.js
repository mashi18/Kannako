const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ledger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ledger',
  },
  type: {
    type: String,
    enum: ['IN', 'OUT'],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'online', 'udhaar'],
    default: 'cash',
  },
  synced: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ ledger: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
