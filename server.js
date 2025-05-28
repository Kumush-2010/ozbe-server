const express = require("express");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { create } = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const connectDB = require("./config/db");
const apiRoutes = require("./app");
const { jwtAccessMiddleware } = require("./middleware/jwt-access.middleware");

connectDB();

const app = express(); // faqat bitta express ilova bo‘ladi

// Handlebars sozlamalari
const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./adminpage/views"); // hbs fayllaringiz shu joyda
// app.set('views', path.join(__dirname, 'adminpage', 'views'));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: "Admin", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(express.static("adminpage")); 

// Uploads statik fayllar (API uchun)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Frontend routes (hbs sahifalar)
app.get("/", (req, res) => {
  res.redirect("/admin");
});

app.get('/api/admin/login', (req, res) => {
    res.render('login', { layout: false });
});

app.get("/admin", jwtAccessMiddleware, (req, res) => {
  return res.render("dashboard", { title: "Admin Panel", layout: false });
});

app.get("/admins", jwtAccessMiddleware, async(req, res) => {  
  return res.render("admin", { title: "Admins", layout: false });
})

app.get("/users", async(req, res) => {  
  return res.render("users", { title: "Users", layout: false });
})

// API routes
app.use("/api", apiRoutes);

// Server ishga tushurish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});




