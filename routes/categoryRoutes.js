const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  categoriesPage,
} = require("../controllers/categoryController");
const {
  authMiddleware
} = require("../middleware/admin-access.middleware");
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")

router
.get("/all", categoriesPage)
.get("/", getAllCategories)
.post(
  "/create",
  roleAccessMiddleware(["superadmin", "admin"]),
  createCategory
) 
.delete(
  "/delete/:id",
  roleAccessMiddleware(["superadmin", 'admin']),
  deleteCategory
)

module.exports = router;