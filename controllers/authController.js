const User = require("../models/user");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// JWT token yaratish
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email bandligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email allaqachon band" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Ro‘yxatdan o‘tishda xatolik" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Foydalanuvchi borligini tekshirish
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin topilmadi!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Noto‘g‘ri parol!" });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        adminName: admin.adminName,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,     // JavaScript ko‘ra olmaydi
      secure: false,      // HTTPS bo‘lsa true qilinadi
      maxAge: 24 * 60 * 60 * 1000, // 1 kun
    });

    return res.status(200).json({ message: "Tizimga muvaffaqiyatli kirdingiz" });
  } catch (err) {
    res.status(500).json({ message: "Kirishda xatolik" });
    console.log(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Chiqdingiz!" });
};