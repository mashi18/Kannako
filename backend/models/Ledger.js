const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

ledgerSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Ledger', ledgerSchema);
