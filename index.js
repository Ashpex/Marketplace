const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

var app = express();

app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/blog-details", function (req, res) {
  res.render("blog-details");
});

app.get("/blog", function (req, res) {
  res.render("blog");
});

app.get("/checkout", function (req, res) {
  res.render("checkout");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});
app.get("/shop-details", function (req, res) {
  res.render("shop-details");
});

app.get("/shop-grid", function (req, res) {
  res.render("shop-grid");
});
app.get("/shoping-cart", function (req, res) {
  res.render("shoping-cart");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
