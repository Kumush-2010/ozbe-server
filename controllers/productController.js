const Product = require('../models/product');
const Category = require('../models/category');
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
exports.productsPage = async (req, res) => {
  return res.render("products", { layout: false });
};

// POST /api/products
exports.createProduct = async (req, res) => {
   try {
    const { name, color, size, description, price, countInStock, category_id } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Iltimos, kamida bitta rasm tanlang.' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const fileContent = fs.readFileSync(file.path);
      const fileExt = path.extname(file.originalname);
      const fileName = `products/${Date.now()}-${file.originalname}`;

      const { data, error } = await supabase
        .storage
        .from('images') // supabase bucket nomi
        .upload(fileName, fileContent, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error('Supabase yuklash xatolik:', error);
        return res.status(500).json({ message: 'Rasmni yuklashda xatolik yuz berdi.' });
      }

      const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
      uploadedUrls.push(imageUrl);
    }

    // Mahsulot MongoDBga saqlanmoqda
    const newProduct = await Product.create({
      name,
      color,
      size,
      description,
      price,
      countInStock,
      category: category_id,
      images: uploadedUrls, // array of Supabase URLs
    });

    res.status(201).json({ message: 'Mahsulot qo‘shildi!', product: newProduct });
  } catch (err) {
    console.error('Serverda xatolik:', err);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
  }
};


// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name')
      .exec();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Xatolik' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Topilmadi' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Xatolik' });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
try {
   const id = req.params.id;
    console.log("Update uchun kelgan ID:", id);

    if (!id) {
      return res.status(400).json({ message: "Product ID yo'q" });
    }
    const { name, description, price, countInStock, category_id } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Mahsulot topilmadi." });
    }

    const updateData = {
      name,
      description,
      price,
      countInStock,
      category: category_id,
    };

    // Agar yangi rasm(lar) yuborilgan bo‘lsa
    if (req.files && req.files.length > 0) {
      const bucketName = 'images';
      const uploadedUrls = [];

      // Eski rasmlarni Supabase'dan o‘chirish
      if (product.images && product.images.length > 0) {
        for (const imgUrl of product.images) {
          const filePath = imgUrl.split(`${bucketName}/`)[1];
          if (filePath) {
            const { error: removeError } = await supabase.storage
              .from(bucketName)
              .remove([filePath]);

            if (removeError) {
              console.error("Rasmni o‘chirishda xatolik:", removeError.message);
            }
          }
        }
      }

      // Yangi rasm(lar)ni Supabase'ga yuklash
      for (const file of req.files) {
        const fileContent = fs.readFileSync(file.path);
        const fileName = `products/${Date.now()}-${file.originalname}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileContent, {
            contentType: file.mimetype,
          });

        if (uploadError) {
          console.error("Supabase yuklash xatolik:", uploadError.message);
          return res.status(500).json({ message: "Yangi rasmni yuklashda xatolik yuz berdi." });
        }
 try {
    fs.unlinkSync(file.path);
  } catch (err) {
    console.error("Faylni uploads/ dan o‘chirishda xatolik:", err.message);
  }
        const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${fileName}`;
        uploadedUrls.push(imageUrl);
      }

      updateData.images = uploadedUrls;
    }

    // Yangilash
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate('category');
    res.status(200).json({ message: 'Mahsulot yangilandi!', product: updatedProduct });

  } catch (error) {
    console.error("Server xatoligi:", error);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
  }
};


// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Topilmadi' });
    res.json({ message: 'O‘chirildi' });
  } catch {
    res.status(500).json({ message: 'Xatolik' });
  }
};

// Qidiruv
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // 🔍 Nomi bo‘yicha qidiruv
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // 'i' = case-insensitive
    }

    // 📂 Kategoriya bo‘yicha filter
    if (category) {
      query.category = category;
    }

    // 💸 Narx oralig‘i
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // 🧾 Saralash
    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;

    // 📄 Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};