const Ledger = require('../models/Ledger');

exports.createLedger = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const existing = await Ledger.findOne({ user: req.user._id, name });
    if (existing) {
      return res.status(400).json({ message: 'Customer already exists' });
    }
    const ledger = await Ledger.create({ user: req.user._id, name, phone });
    res.status(201).json({ ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLedgers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { user: req.user._id };
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const ledgers = await Ledger.find(filter).sort({ updatedAt: -1 });
    res.json({ ledgers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLedgerById = async (req, res) => {
  try {
    const ledger = await Ledger.findOne({ _id: req.params.id, user: req.user._id });
    if (!ledger) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLedger = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const ledger = await Ledger.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, phone },
      { new: true, runValidators: true }
    );
    if (!ledger) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!ledger) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
