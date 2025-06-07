const Product = require("../models/product");
const Order = require("../models/order");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
require("dotenv").config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const fs = require("fs");

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });
const upload = multer({ storage });

const adminsPage = async (req, res) => {
  return res.render("admin", { layout: false });
};

const allAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();

    if (!admins) {
      return res.status(400).send({
        message: "Adminlar topilmadi!",
      });
    } else {
      return res.status(200).json({ message: "Adminlar", admins });
    }
  } catch (error) {
    console.error("Adminlarni olishda xatolik:", error);
    return res.status(500).json({ error: "Server xatosi yuz berdi." });
  }
};

const adminCreate = async (req, res) => {
  try {
    const { adminname, birth, jins, phone, email, password, role } = req.body;

    if (!req.file) {
      return res.status(404).json({ message: "Fayl topilmadi" });
    }

    const bucketName = "images";
    const fileName = `admins/${Date.now()}_${req.file.originalname}`;

    // Faylni Supabase'ga yuborish
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, req.file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      console.error("Tasvirni yuklashda xato:", uploadError.message);
      return res.status(500).json({ message: "Rasm yuklashda xatolik yuz berdi" });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData?.publicUrl || "";

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email allaqachon mavjud" });

    const newAdmin = new Admin({
      adminname,
      birth,
      jins,
      phone,
      email,
      role: role || "admin",
      password: hashedPassword,
      image: imageUrl,
      lastLogin: null,
    });

    await newAdmin.save();

    return res.status(200).json({ message: `${role} muvaffaqiyatli yaratildi` });
  } catch (error) {
    console.error("Admin yaratishda server xatoligi:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
};


const adminEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin topilmadi." });
    }

    const { adminname, birth, email, phone, role, jins, password } = req.body;
    const updateData = { adminname, birth, email, phone, role, jins };

    // Agar yangi rasm yuborilgan bo‘lsa:
    if (req.file) {
      const bucketName = "images";
      const newFileName = `admins/${Date.now()}_${req.file.originalname}`;

      // 1) Eski rasmni o‘chirish (agar bor bo‘lsa)
      if (admin.image && admin.image.includes(`storage/v1/object/public/${bucketName}/`)) {
        // URL: https://xyz.supabase.co/storage/v1/object/public/images/admins/...png
        const oldFilePath = admin.image.split(`${bucketName}/`)[1]; 
        // ➔ oldFilePath = "admins/162xxxx_avatar.png"
        if (oldFilePath) {
          const { error: removeError } = await supabase.storage
            .from(bucketName)
            .remove([oldFilePath]);
          if (removeError) {
            console.error("Supabase remove error:", removeError.message);
            // Eski rasm o‘chmasa ham davom etamiz
          }
        }
      }

      // 2) Yangi rasmni yuklash
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(newFileName, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError.message);
        return res.status(500).json({ message: "Rasm yuklashda xatolik yuz berdi" });
      }

      // 3) Yangi rasm public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(newFileName);

      if (urlError) {
        console.error("Supabase getPublicUrl error:", urlError.message);
        return res.status(500).json({ message: "Rasm URL olishda xatolik yuz berdi" });
      }

      updateData.image = publicUrl;
        console.log("👀 YANGI UPDATE DATA:", updateData);
    }

    // Agar parol o‘zgargan bo‘lsa:
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Ma’lumotlarni yangilash
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    console.log("👀 UPDATED ADMIN:", updatedAdmin);
    return res.status(200).json({
      message: "Admin muvaffaqiyatli yangilandi",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Adminni yangilashda xatolik:", error);
    return res.status(500).json({ error: "Server xatosi yuz berdi." });
  }
};




const adminDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: "Admin topilmadi!" });
    }

    await Admin.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Admin muvaffaqiyatli o‘chirildi." });
  } catch (error) {
    console.error("Adminni o‘chirishda xatolik:", error);
    return res.status(500).json({ error: "Server xatosi yuz berdi." });
  }
};


const getAdminStats = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const adminCount = await Admin.countDocuments();
    const orderCount = await Order.countDocuments();

    const orders = await Order.find({ status: "paid" });
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // 🔢 So‘nggi 7 kunlik buyurtmalar (kunlar bo‘yicha guruhlash)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6); // bugun + oldingi 6 kun

    const recentOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          status: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      productCount,
      adminCount,
      orderCount,
      totalRevenue,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  adminsPage,
  allAdmins,
  adminCreate,
  adminEdit,
  adminDelete,
  getAdminStats,
  upload 
}