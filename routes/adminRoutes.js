const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { getAdminStats } = require("../controllers/adminpageController.js");

// 👑 Admin statistikasi
router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

router.post(
  "/adminpages",
  authMiddleware,
  allowRoles("superadmin"),
  createAdmin
);
router.put(
  "/adminpages/:id",
  authMiddleware,
  allowRoles("superadmin"),
  updateAdmin
);
router.delete(
  "/adminpages/:id",
  authMiddleware,
  allowRoles("superadmin"),
  deleteAdmin
);
router.get(
  "/adminpages",
  authMiddleware,
  allowRoles("admin", "superadmin"),
  getAllAdmins
);
router.put(
  "/adminpages/profile",
  authMiddleware,
  allowRoles("admin", "superadmin"),
  updateOwnProfile
);

module.exports = router;
