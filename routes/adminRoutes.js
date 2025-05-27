const express = require("express");
const router = express.Router();
// const { authMiddleware, adminMiddleware } = require("../middleware/auth");
// const { getAdminStats } = require("../controllers/adminController.js");
const { adminCreate, allAdmins, adminEdit } = require('../controllers/adminController.js');
const { adminAccessMiddleware } = require("../middleware/admin-access.middleware.js")
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")
const { loginLimiter } = require("../middleware/loginLimiter.js")
const { login } = require('../controllers/authController');
const Admin = require('../models/admin.js');

router.get('/', allAdmins );

// login sahifasini render qilish
router.get('/login', (req, res) => {
res.render('login', { layout: false });
});

router.post("/login", loginLimiter, login);

router.get('/create', (req, res) => {
  res.render('admin-create'); // hbs fayl nomi
});

router.post('/create', adminCreate);

// router.get('/edit', (req, res) => {
//   res.render('admin-edit')
// })

router.put(
  '/edit/:id', 
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  adminEdit
)

// router.get('/', )



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