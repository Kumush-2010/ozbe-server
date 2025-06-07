const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
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

const adminProfil = async (req, res) => {
  const adminId = req.cookies.adminId;
  if (!adminId) {
    return res.status(401).json({ message: "ID topilmadi. Iltimos, qayta login qiling." });
  }

  try {
    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) return res.status(404).json({ message: "Admin topilmadi" });

    // ✅ admin obyektini view’ga uzatyapmiz:
    return res.render('profil', {
      layout: false,
      admin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 2) Admin profil ma’lumotlarini yangilash
const updateAdminProfile = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // console.log(req.file);
  
  try {
    if (req.file) {
      const bucketName = "images";
      // MemoryStorage’da fayl bufferdan o‘qilyapti:
      const fileBuffer = req.file.buffer;
      const fileName = `admins/${Date.now()}_${req.file.originalname}`;

      // Supabase’ga yuklaymiz:
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return res.status(500).json({ message: "Rasm yuklashda xatolik yuz berdi" });
      }

      // Public URL olish:
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Supabase getPublicUrl error:", urlError);
        return res.status(500).json({ message: "Rasm URL olishda xatolik yuz berdi" });
      }

      updates.image = publicUrl;
    }

    // console.log(updates);
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }

    return res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatoligi" });
  }
};


module.exports = {
  adminProfil,
  updateAdminProfile,
  upload 
}