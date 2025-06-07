const express = require("express");
const router = express.Router();
const { register, loginAdmin, loginPage, logout } = require('../controllers/authController');

router
.get('/login', loginPage)
.post("/register", register)
.post("/login",  loginAdmin)
.get('/logout', logout)

module.exports = router;
