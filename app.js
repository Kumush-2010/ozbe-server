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
Router.use("/auth", authRoutes);
Router.use('/admin', adminRoutes); 
Router.use('/users', usersRoutes)
Router.use('/categories', categoryRoutes);
Router.use('/products', productRoutes);
Router.use('/cart', cartRoutes);
Router.use('/orders', orderRoutes);


module.exports = Router;
