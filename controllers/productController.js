const Product = require('../models/product');

// POST /api/products
exports.createProduct = async (req, res) => {
  
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Topilmadi' });
    res.json(product);
  } catch {
    res.status(400).json({ message: 'Xatolik' });
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
