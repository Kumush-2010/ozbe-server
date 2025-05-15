const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// JWT token yaratish
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email bandligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email allaqachon band' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Ro‘yxatdan o‘tishda xatolik' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Foydalanuvchi borligini tekshirish
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Email noto‘g‘ri' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Parol noto‘g‘ri' });

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Kirishda xatolik' });
    console.log(err)
  }
};
