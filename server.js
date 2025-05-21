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
connectDB();

const app = express();

// Handlebars sozlamalari
const hbs = create({
  defaultLayout: "main", // layout fayli: main.hbs
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// app.engine("hbs", hbs.engine);
// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "adminpage")); // sahifalar shu yerda

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./adminpage/views");

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({ secret: "Admin", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(express.static("adminpage"));

// Routes
app.get("/", (req, res) => {
  res.redirect("/admin");
});

app.get("/admin", (req, res) => {
  return res.render("dashboard", { title: "Admin Panel", layout: false }); // main.hbs layout ichida views/dashboard.hbs yuklanadi
});

app.get("/admins", async(req, res) => {
  try {
    const response = await fetch('http://127.0.0.1:3000/admins');
    const data = await response.json();
    res.render('admin', { admins: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Xatolik yuz berdi");
  }
})

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});
