const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const user = require("../models/user");

exports.usersPage = async (req, res) => {
  return res.render("users", { layout: false });
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Userlar topilmadi!" });
    }

    // Har bir user uchun orderCountni hisoblash
    const usersWithOrderCount = await Promise.all(users.map(async (user) => {
      const orderCount = await Order.countDocuments({ user: user._id });
      return {
        ...user.toObject(),
        orderCount
      };
    }));

    return res.status(200).json({
      message: "Userlar ro‘yxati",
      users: usersWithOrderCount
    });
  } catch (error) {
    console.error("Userlarni olishda xatolik:", error);
    return res.status(500).json({ error: "Server xatosi yuz berdi." });
  }
};


exports.userCreate = async (req, res) => {
  try {
    console.log("💡 User yaratish ishladi", req.body);
    const { name, birth, jins, phone, email, image, password, role } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({
      name,
      birth,
      jins,
      phone,
      email,
      role: role || "User",
      password: hashedPassword,
      image: image || "",
      lastLogin: null,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ message: `${role} muvaffaqiyatli yaratildi` });
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.userEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const User = await User.findById(id);

    if (!User) {
      return res.status(404).json({ error: "User topilmadi." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, birth, email, phone, role, jins, image, password } =
      req.body;

    const updateData = {
      name,
      birth,
      email,
      phone,
      role,
      jins,
      image,
    };

    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "User muvaffaqiyatli yangilandi", data: updatedUser });
  } catch (error) {
    console.error("Userni yangilashda xatolik:", error);
    return res.status(500).json({ error: "Server xatosi yuz berdi." });
  }
};

exports.userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User topilmadi!" });
    }


    await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "User muvaffaqiyatli o‘chirildi." });
  } catch (error) {
    console.error("Userni o‘chirishda xatolik:", error);
    return res.status(500).json({ error: "Server xatosi yuz berdi." });
  }
};