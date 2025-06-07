const express = require("express");
const router = express.Router();
const { adminCreate, allAdmins, adminEdit, adminsPage, adminDelete,  } = require('../controllers/adminController.js');
const { adminProfil, updateAdminProfile, } = require("../controllers/adminProfilController.js")
const { adminAccessMiddleware } = require("../middleware/admin-access.middleware.js")
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router
.get('/admins', adminsPage)
.get('/', allAdmins )
.get('/create', (req, res) => {
  res.render('admin-create'); 
})
.post('/create', upload.single('image'), adminCreate)
.put(
  '/edit/:id', 
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  upload.single('image'),
  adminEdit
)
.delete(
  '/delete/:id',
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  adminDelete
)
.get(
  '/profil',
  adminProfil
)
.post(
  "/profil/:id", 
  upload.single('image'),
  updateAdminProfile
)



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
  // updateOwnProfile
// );