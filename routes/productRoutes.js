const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
  productsPage,
} = require("../controllers/productController");
const { adminAccessMiddleware } = require("../middleware/admin-access.middleware.js")
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")
const upload = require("../middleware/upload");

router
.get('/all', productsPage)
.get('/', getAllProducts)
// .get("/", getProducts)
.get("/:id", getProductById)
.get('/create', (req, res) => {
  res.render('products'); 
})
.post(
  "/create",
  roleAccessMiddleware(["superadmin"]),
  // upload.single("images", 5),
  upload.array('images'),
  createProduct
)
.put(
  "/edit/:id",
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  upload.array('images'),
  updateProduct
)
.delete(
  "/delete/:id",
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  deleteProduct
);

module.exports = router;