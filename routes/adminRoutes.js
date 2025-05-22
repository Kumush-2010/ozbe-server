const express = require("express");
const router = express.Router();
// const { authMiddleware, adminMiddleware } = require("../middleware/auth");
// const { getAdminStats } = require("../controllers/adminController.js");
const { adminCreate } = require('../controllers/adminController.js');

router.get('/create', (req, res) => {
  res.render('admin-create'); // hbs fayl nomi
});

router.post('/create', adminCreate);

module.exports = router;

//"adminname": "admin",
  // "birth": "2010-01-01",
  // "jins": "ayol",
  // "phone": "+998904385114",
  // "email": "kumush@gmail.com",
  // "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBnBg4GGhbqK6YYf95JDTBnoVf0rhF3en3GsXXnXWMkqFxR8_j5cw4LEgfOVKJT6siwdY&usqp=CAU",
  // "password": "kumush12" 

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