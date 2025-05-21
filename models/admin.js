const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminname: { type: String },
  email:    { type: String, unique: true },
  phone: { type: Number },
  password: { type: String, },
  role:     { type: String, enum: ["superadmin", "admin"], default: "admin"},
  lastLogin: { type: Date, default: Date.now },
  images: { type: [String] },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
