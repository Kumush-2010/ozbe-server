const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  payForOrder
} = require('../controllers/orderController');
const { authMiddleware, allowRoles } = require('../middleware/authMiddleware');


// Auth user
router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);
// Foydalanuvchi: to'lov qilish
router.post('/:orderId/pay', authMiddleware, payForOrder);

// Admin
router.get('/', authMiddleware, allowRoles('admin', 'superadmin'), getAllOrders);
router.put('/:id/status', authMiddleware, allowRoles('admin', 'superadmin'), updateOrderStatus);
// Admin: to‘lov holatini o‘zgartirish
router.put('/:id/payment-status', authMiddleware, allowRoles('admin', 'superadmin'), updatePaymentStatus);

module.exports = router;
