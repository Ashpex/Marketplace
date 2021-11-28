const productRouter = require("./product");

const homeRouter = require("./home");

function route(app) {
  //   app.get("/", function (req, res) {
  //     res.render("home/home");
  //   });

  // app.get('/shop-grid',function(req,res){
  //     res.render('shop-grid/shop-grid');
  // });

  app.use("/", homeRouter);

  app.use("/shop-grid", productRouter);

  app.get("/shop-details", function (req, res) {
    res.render("shop-details/shop-details");
  });

  app.get("/shoping-cart", function (req, res) {
    res.render("shoping-cart/shoping-cart");
  });

  app.get("/blog", function (req, res) {
    res.render("blog/blog");
  });

  app.get("/blog-details", function (req, res) {
    res.render("blog-details/blog-details");
  });

  app.get("/contact", function (req, res) {
    res.render("contact/contact");
  });

  app.get("/checkout", function (req, res) {
    res.render("checkout/checkout");
  });
}

module.exports = route;
