const ShoppingCart = require("../models/ShoppingCart");
const ProductOrder = require("../models/ProductOrder");
const User = require("../models/User");
const Product = require("../models/Product");

module.exports = {
  getIndex: async (req, res) => {
    if (!req.user) {
      res.redirect("/login?error=notLoggedIn");
      return;
    }
    const user = await User.findOne({ email: req.user.email });
    const shoppingCart = await ShoppingCart.findById(user.idShoppingCart);
    let listProductOrder = [];
    let sumPrice = 0;
    for await (let idProductOrder of shoppingCart.listProductOrder) {
      let productOrder = await ProductOrder.findById(idProductOrder).lean();
      console.log(productOrder);
      productOrder.sumPriceProduct =
        productOrder.quantity * productOrder.unitPrice;
      sumPrice += productOrder.sumPriceProduct;
      listProductOrder.push(productOrder);
    }
    console.log(listProductOrder);
    res.render("checkout/checkout", {
      listProductOrder: listProductOrder,
      sumPrice: sumPrice,
    });
  },
  postCheckOut: async (req, res) => {},
};
