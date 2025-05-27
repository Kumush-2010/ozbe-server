const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  authMiddleware
} = require("../middleware/admin-access.middleware");
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")

router.post(
  "/",
  roleAccessMiddleware(["superadmin", "admin"]),
  createCategory
);
router.get("/", getAllCategories);
router.put(
  "/:id",
  roleAccessMiddleware(["superadmin", "admin"]),
  updateCategory
);
router.delete(
  "/:id",
  roleAccessMiddleware(["superadmin", 'admin']),
  deleteCategory
);

module.exports = router;
