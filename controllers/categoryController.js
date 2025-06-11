const Category = require('../models/category');

const { createClient } = require('@supabase/supabase-js');
require("dotenv").config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.categoriesPage = async (req, res) => {
  return res.render("categories", { layout: false });
};
// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
       if (!req.file) {
          return res.status(404).json({ message: "Fayl topilmadi" });
        }
    
        const bucketName = "images";
        const fileName = `categories/${Date.now()}_${req.file.originalname}`;
    
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

    const category = new Category({
      name,
      image: imageUrl,
    });

    await category.save();
    return res.status(201).json({
        message: "Kategoriya yaratildi"
    }, category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/categories
exports.getAllCategories = async (req, res) => {
   try {
      const categories = await Category.find();
  
      if (!categories) {
        return res.status(400).send({
          message: "categorylar topilmadi!",
        });
      } else {
        return res.status(200).json({ message: "categorylar", categories });
      }
    } catch (error) {
      console.error("categorylarni olishda xatolik:", error);
      return res.status(500).json({ error: "Server xatosi yuz berdi." });
    }
};


// PUT /api/categories/:id
// exports.updateCategory = async (req, res) => {
//  try {
//     const { id } = req.params;
//     const category = await Category.findById(id);
//     if (!category) {
//       return res.status(404).json({ error: "Kategoriya topilmadi." });
//     }

//     const { name } = req.body;
//     const updateData = { name };

//  if (req.file) {
//       const bucketName = "images";
//       const newFileName = `categorys/${Date.now()}_${req.file.originalname}`;

//       if (category.image && category.image.includes(`storage/v1/object/public/${bucketName}/`)) {
//         const oldFilePath = category.image.split(`${bucketName}/`)[1]; 
//         if (oldFilePath) {
//           const { error: removeError } = await supabase.storage
//             .from(bucketName)
//             .remove([oldFilePath]);
//           if (removeError) {
//             console.error("Supabase remove error:", removeError.message);
//           }
//         }
//       }

//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from(bucketName)
//         .upload(newFileName, req.file.buffer, {
//           cacheControl: "3600",
//           upsert: false,
//           contentType: req.file.mimetype,
//         });

//       if (uploadError) {
//         console.error("Supabase upload error:", uploadError.message);
//         return res.status(500).json({ message: "Rasm yuklashda xatolik yuz berdi" });
//       }

//       const { data: { publicUrl }, error: urlError } = supabase.storage
//         .from(bucketName)
//         .getPublicUrl(newFileName);

//       if (urlError) {
//         console.error("Supabase getPublicUrl error:", urlError.message);
//         return res.status(500).json({ message: "Rasm URL olishda xatolik yuz berdi" });
//       }

//       updateData.image = publicUrl;
//         console.log("👀 YANGI UPDATE DATA:", updateData);
//     }

//     const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
//     return res.status(200).json(updated);
//   } catch (error) {
//     return res.status(500).json({ message: 'Yangilashda xatolik' });
//   }
// };

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    return res.json({ message: 'Kategoriya o‘chirildi' });
  } catch (error) {
    return res.status(500).json({ message: 'O‘chirishda xatolik' });
  }
};