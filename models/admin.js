const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminname: { type: String,},
  birth: { type: Date, },
  jins: { type: String, enum: ['ayol', 'erkak'],},
  phone: { type: String,  unique: true },
  email: { type: String,  unique: true },
  role: { type: String, enum: ["superadmin", "admin"], default: "admin"},
  lastLogin: { type: Date },
  image: { type: String },
  password: { type: String,},
}, { timestamps: true });



module.exports = mongoose.model('Admin', adminSchema);
