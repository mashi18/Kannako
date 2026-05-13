const Transaction = require('../models/Transaction');
const Ledger = require('../models/Ledger');

exports.createTransaction = async (req, res) => {
  try {
    const { ledgerId, type, amount, description, category, date, paymentMode } = req.body;
    let ledger = null;
    const pm = paymentMode || 'cash';
    if (ledgerId && pm === 'udhaar') {
      ledger = await Ledger.findOne({ _id: ledgerId, user: req.user._id });
      if (!ledger) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      const change = type === 'IN' ? amount : -amount;
      ledger.balance += change;
      await ledger.save();
    }
    const transaction = await Transaction.create({
      user: req.user._id,
      ledger: ledgerId || undefined,
      type,
      amount,
      description,
      category: category || 'General',
      date: date || Date.now(),
      paymentMode: pm,
    });
    const populated = await Transaction.findById(transaction._id).populate('ledger', 'name');
    res.status(201).json({ transaction: populated, ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, ledgerId, startDate, endDate } = req.query;
    const filter = { user: req.user._id };
    if (ledgerId) filter.ledger = ledgerId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const transactions = await Transaction.find(filter)
      .populate('ledger', 'name')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Transaction.countDocuments(filter);
    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const [
      todayTransactions,
      weekTransactions,
      monthTransactions,
      ledgers,
    ] = await Promise.all([
      Transaction.find({ user: req.user._id, date: { $gte: today } }),
      Transaction.find({ user: req.user._id, date: { $gte: weekStart } }),
      Transaction.find({ user: req.user._id, date: { $gte: monthStart } }),
      Ledger.find({ user: req.user._id }),
    ]);
    const calc = (txns) => ({
      totalIn: txns.filter(t => t.type === 'IN').reduce((s, t) => s + t.amount, 0),
      totalOut: txns.filter(t => t.type === 'OUT').reduce((s, t) => s + t.amount, 0),
      count: txns.length,
    });
    const totalReceivable = ledgers.filter(l => l.balance > 0).reduce((s, l) => s + l.balance, 0);
    const totalPayable = ledgers.filter(l => l.balance < 0).reduce((s, l) => s + Math.abs(l.balance), 0);
    res.json({
      today: calc(todayTransactions),
      week: calc(weekTransactions),
      month: calc(monthTransactions),
      totalReceivable,
      totalPayable,
      customerCount: ledgers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.syncTransactions = async (req, res) => {
  try {
    const { transactions } = req.body;
    const created = [];
    for (const txn of transactions) {
      let ledger = null;
      const pm = txn.paymentMode || 'cash';
      if (txn.ledgerId && pm === 'udhaar') {
        ledger = await Ledger.findOne({ _id: txn.ledgerId, user: req.user._id });
        if (ledger) {
          const change = txn.type === 'IN' ? txn.amount : -txn.amount;
          ledger.balance += change;
          await ledger.save();
        }
      }
      const createdTxn = await Transaction.create({
        user: req.user._id,
        ledger: txn.ledgerId || undefined,
        type: txn.type,
        amount: txn.amount,
        description: txn.description,
        category: txn.category || 'General',
        date: txn.date || Date.now(),
        paymentMode: pm,
        synced: true,
      });
      created.push(createdTxn);
    }
    res.status(201).json({ synced: created.length, transactions: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
