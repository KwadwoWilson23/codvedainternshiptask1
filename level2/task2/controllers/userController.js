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
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid user id' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid user id' });
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updates = { ...req.body };
    delete updates.password;
    if (req.user.role !== 'admin') delete updates.role;
    const updated = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid user id' });
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted', user: deleted });
  } catch (err) {
    next(err);
  }
};
