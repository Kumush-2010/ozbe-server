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
const apiRoutes = require("./app"); // bu sizning API marshrutlaringizni o‘z ichiga oladi

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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: "Admin", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(express.static("adminpage")); // CSS, JS, rasmlar

// Uploads statik fayllar (API uchun)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Frontend routes (hbs sahifalar)
app.get("/", (req, res) => {
  res.redirect("/admin");
});

app.get("/admin", (req, res) => {
  return res.render("dashboard", { title: "Admin Panel", layout: false });
});

app.get("/admins", async(req, res) => {
  // try {
  //   const response = await fetch('http://127.0.0.1:3000/admins');
  //   const data = await response.json();
  //   res.render('admin', { admins: data });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send("Xatolik yuz berdi");
  // }
   
  return res.render("admin", { title: "Admins", layout: false });
})


// API routes
app.use("/api", apiRoutes); // bu orqali /api/auth, /api/products va boshqalar ishlaydi

// Server ishga tushurish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});




