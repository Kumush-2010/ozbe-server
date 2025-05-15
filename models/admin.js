const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, },
  email:    { type: String, unique: true },
  password: { type: String, },
  role:     { type: String, enum: ["superadmin", "admin"], default: "admin"}
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
