const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).populate('owner', 'name email');
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid product id' });
    const product = await Product.findById(id).populate('owner', 'name email');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { owner } = req.body;
    if (!owner || !isValidId(owner)) {
      return res.status(400).json({ error: 'Valid owner (user id) is required' });
    }
    const userExists = await User.exists({ _id: owner });
    if (!userExists) return res.status(400).json({ error: 'Owner user does not exist' });
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid product id' });
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid product id' });
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    next(err);
  }
};
