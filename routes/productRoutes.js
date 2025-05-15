const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts
} = require('../controllers/productController');
const { authMiddleware, allowRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// router.get('/', getAllProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, allowRoles('admin', 'superadmin'), upload.single('image'), createProduct);
router.put('/:id', authMiddleware, allowRoles('admin', 'superadmin'), updateProduct);
router.delete('/:id', authMiddleware, allowRoles('admin', 'superadmin'), deleteProduct);

module.exports = router;
