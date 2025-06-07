const Category = require('../models/category');

exports.categoriesPage = async (req, res) => {
  return res.render("categories", { layout: false });
};
// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
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
    const categories = await Category.find().sort({ createdAt: -1 }).select('_id name'); 
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Kategoriya olishda xatolik' });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
 try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Yangilashda xatolik' });
  }
};

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