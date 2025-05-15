const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authMiddleware, allowRoles } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, allowRoles('admin', 'superadmin'), createCategory);
router.get('/', getAllCategories);
router.put('/:id', authMiddleware, allowRoles('admin', 'superadmin'), updateCategory);
router.delete('/:id', authMiddleware, allowRoles('admin', 'superadmin'), deleteCategory);

module.exports = router;
