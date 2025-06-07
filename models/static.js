const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  totalUsers: Number,
  totalOrders: Number,
  totalSales: Number,
  productsInStock: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stat', statSchema);
