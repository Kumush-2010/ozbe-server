const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  deleteCategory,
  categoriesPage,
} = require("../controllers/categoryController");
const {
  authMiddleware
} = require("../middleware/admin-access.middleware");
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router
.get("/all", categoriesPage)
.get("/", getAllCategories)
.post(
  "/create",
  roleAccessMiddleware(["superadmin", "admin"]),
   upload.single('image'),
  createCategory
) 
.delete(
  "/delete/:id",
  roleAccessMiddleware(["superadmin", 'admin']),
  deleteCategory
)

module.exports = router;