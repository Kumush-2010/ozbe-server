const express = require("express");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
const { create } = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const connectDB = require("./config/db");
const Router = require('./app');
const { jwtAccessMiddleware } = require("./middleware/jwt-access.middleware");
const cors = require('cors');

connectDB();

// Handlebars sozlamalari
const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    eq: (a, b) => a === b
  }
});

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(flash());

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "adminpage", "views"));

// Statik fayllar
app.use(express.static(path.join(__dirname, "adminpage")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/adminpage/css', express.static(path.join(__dirname, 'adminpage/css')));
app.use('/adminpage/js', express.static(path.join(__dirname, 'adminpage/js')));

app.use(session({
  secret: "Admin",
  resave: false,
  saveUninitialized: false
}));

// Frontend route
app.get("/", (req, res) => {
  res.redirect("/admin");
});

app.get("/admin", jwtAccessMiddleware, (req, res) => {
  return res.render("dashboard", { title: "Admin Panel", layout: false });
});

// API routes
app.use("/api", Router);


app.use((req, res) => {
  res.status(404).render("404", { layout: false });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { layout: false });
});


// Server ishga tushurish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});
