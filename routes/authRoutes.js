const express = require("express");
const router = express.Router();
const { loginAdmin, loginPage, logout } = require('../controllers/authController');

router
.get('/login', loginPage)
.post("/login",  loginAdmin)
.get('/logout', logout)

module.exports = router;
