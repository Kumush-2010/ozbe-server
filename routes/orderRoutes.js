const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  payForOrder,
} = require("../controllers/orderController");

const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")

// Auth user
router.post("/",  createOrder);
router.get("/my",  getMyOrders);
router.get("/:id",  getOrderById);
// Foydalanuvchi: to'lov qilish
router.post("/:orderId/pay",  payForOrder);

// Admin
router.get(
  "/",
   roleAccessMiddleware(["superadmin", "admin"]),
  getAllOrders
);
router.put(
  "/:id/status",
   roleAccessMiddleware(["superadmin", "admin"]),
  updateOrderStatus
);
// Admin: to‘lov holatini o‘zgartirish
router.put(
  "/:id/payment-status",
   roleAccessMiddleware(["superadmin", "admin"]),
  updatePaymentStatus
);

module.exports = router;
