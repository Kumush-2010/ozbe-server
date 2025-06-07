const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminname: { type: String,},
  birth: { type: String, },
  jins: { type: String, enum: ['ayol', 'erkak'],},
  phone: { type: String,  unique: true, match: /^\+998[0-9]{9}$/ },
  email: { type: String,  unique: true },
  role: { type: String, enum: ["superadmin", "admin"], default: "admin"},
  lastLogin: { type: Date },
  image: { type: String },
  password: { type: String,},
}, { timestamps: true });



module.exports = mongoose.model('Admin', adminSchema);
