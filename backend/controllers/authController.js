const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, phone, password, shopName } = req.body;
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    const user = await User.create({ name, phone, password, shopName });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, shopName: user.shopName },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, shopName: user.shopName },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
