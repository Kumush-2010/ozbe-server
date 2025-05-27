const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateItemQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

const { authMiddleware } = require("../middleware/admin-access.middleware");

// router.use(authMiddleware);

router.post("/add", addToCart);
router.get("/", getCart);
router.put("/update", updateItemQuantity);
router.delete("/remove/:productId", removeItem);
router.delete("/clear", clearCart);

module.exports = router;
