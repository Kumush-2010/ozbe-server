const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
} = require("../controllers/productController");
const { adminAccessMiddleware } = require("../middleware/admin-access.middleware.js")
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")
const upload = require("../middleware/upload");

router.get('/', getAllProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  roleAccessMiddleware(["superadmin"]),
  upload.single("image"),
  createProduct
);
router.put(
  "/:id",
  roleAccessMiddleware(["superadmin"]),
  updateProduct
);
router.delete(
  "/:id",
  roleAccessMiddleware(["superadmin"]),
  deleteProduct
);

module.exports = router;
