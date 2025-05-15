const Category = require('../models/category');

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json({
        message: "Kategoriya yaratildi"
    }, category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(404).json({
    message: "Kategoriyalar topilmadi"
  })

  return res.status(200).json({
    message: "Kategoriyalar"
  }, categories);
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Kategoriya topilmadi' });
    return res.status(200).json({
        message: "Kategorialar"
    }, category);
  } catch {
    res.status(400).json({ message: 'Yangilashda xatolik' });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Kategoriya topilmadi' });
    return res.status(200).json({ message: 'Kategoriya o‘chirildi' });
  } catch {
    res.status(400).json({ message: 'O‘chirishda xatolik' });
  }
};
