const express = require("express");
const router = express.Router();
const { register, login, loginPage, logout } = require('../controllers/authController');

router
.get('/login', loginPage)
.post("/register", register)
.post("/login",  login)
.get('/logout', logout)

module.exports = router;