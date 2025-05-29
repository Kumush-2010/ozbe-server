const express = require("express");
const router = express.Router();
const { adminCreate, allAdmins, adminEdit, adminsPage, adminDelete } = require('../controllers/adminController.js');
const { adminAccessMiddleware } = require("../middleware/admin-access.middleware.js")
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")

router
.get('/admins', adminsPage)
.get('/', allAdmins )
.get('/create', (req, res) => {
  res.render('admin-create'); 
})
.post('/create', adminCreate)
.put(
  '/edit/:id', 
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  adminEdit
)
.delete(
  '/delete/:id',
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  adminDelete
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
//   updateOwnProfile
// );