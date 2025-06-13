const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const usersRoutes = require('./routes/usersRoutes')
const { jwtAccessMiddleware } = require('./middleware/jwt-access.middleware')

const Router = require('express').Router();


// Routes
Router
.use("/auth", authRoutes)
.use('/admin', adminRoutes)
.use('/users', usersRoutes)
.use('/categories', categoryRoutes)
.use('/products', productRoutes)
.use('/cart', cartRoutes)
.use('/orders', orderRoutes)


module.exports = Router;
