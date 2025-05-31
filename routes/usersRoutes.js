const express = require("express");
const { usersPage, allUsers, userCreate, userEdit, userDelete } = require("../controllers/userController");
const { adminAccessMiddleware } = require("../middleware/admin-access.middleware.js")
const { roleAccessMiddleware } = require("../middleware/role-access.middleware.js")
const router = express.Router();

router
.get('/all', usersPage)
.get('/', allUsers )
.get('/create', (req, res) => {
  res.render('users'); 
})
.post('/create', userCreate)
.put(
  '/edit/:id', 
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  userEdit
)
.delete(
  '/delete/:id',
  adminAccessMiddleware,
  roleAccessMiddleware(["superadmin"]),
  userDelete
)

module.exports = router;