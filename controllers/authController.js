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


exports.loginPage = (req, res) => {
    return res.render('login', { layout: false });
}

// admin login

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Login yoki parol xato" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 💾 Cookie-ga token va adminId ni saqlaymiz:
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 kun
    });

 res.cookie("adminId", admin._id.toString(), {
  httpOnly: false,
  maxAge: 24 * 60 * 60 * 1000,
  path: "/"            // cookie butun domen bo‘ylab ko‘rinishi uchun
});


    // res.status(200).json({ message: "Muvaffaqiyatli kirdingiz", token });
    return res.redirect('/admin')
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverda xatolik" });
  }
};


exports.logout = (req, res) => {
  res.clearCookie("token");
  // res.status(200).json({ message: "Chiqdingiz!" });
  return res.redirect('/api/auth/login')
};