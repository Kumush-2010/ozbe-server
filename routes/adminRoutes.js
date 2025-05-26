const express = require("express");
const router = express.Router();
// const { authMiddleware, adminMiddleware } = require("../middleware/auth");
// const { getAdminStats } = require("../controllers/adminController.js");
const { adminCreate, allAdmins, adminEdit } = require('../controllers/adminController.js');
const Admin = require('../models/admin.js');

router.get('/', allAdmins );

router.get('/create', (req, res) => {
  res.render('admin-create'); // hbs fayl nomi
});

router.post('/create', adminCreate);

// router.get('/edit', (req, res) => {
//   res.render('admin-edit')
// })

router.put('/edit/:id', adminEdit)

module.exports = router;


// 👑 Admin statistikasi
// router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

// router.post(
//   "/adminpages",
//   authMiddleware,
//   allowRoles("superadmin"),
//   createAdmin
// );
// router.put(
//   "/adminpages/:id",
//   authMiddleware,
//   allowRoles("superadmin"),
//   updateAdmin
// );
// router.delete(
//   "/adminpages/:id",
//   authMiddleware,
//   allowRoles("superadmin"),
//   deleteAdmin
// );
// router.get(
//   "/adminpages",
//   authMiddleware,
//   allowRoles("admin", "superadmin"),
//   getAllAdmins
// );
// router.put(
//   "/adminpages/profile",
//   authMiddleware,
//   allowRoles("admin", "superadmin"),
//   updateOwnProfile
// );