const mongoose = require('mongoose');
const User = require('../models/User');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const user = await User.create({ name, email, age });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted', user: deleted });
  } catch (err) {
    next(err);
  }
};
