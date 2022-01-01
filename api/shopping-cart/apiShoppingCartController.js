const Session = require("../../models/Session");
const ShoppingCart = require("../../models/ShoppingCart");
const ProductOrder = require("../../models/ProductOrder");
const User = require("../../models/User");

module.exports = {
  addShoppingCart: async (req, res) => {
    const { idProduct } = req.body;
    console.log(idProduct);
    console.log(req.session.unauthId);
    //const newSession = new Session()
    if (!req.user) {
      const session = await Session.findOne({ idUser: req.session.unauthId });
      const shoppingCart = await ShoppingCart.findById(session.idShoppingCart);
      let listProductOrder = [];
      for await (let idProductOrder of shoppingCart.listProductOrder) {
        let productOrder = await ProductOrder.findById(idProductOrder);
        listProductOrder.push(productOrder);
      }
      let id = await containsProduct(idProduct, listProductOrder);
      if (id === null) {
        const productOrder = new ProductOrder({
          idProduct: idProduct,
          quantity: 1,
        });
        await productOrder.save((err, data) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ result: "failed", message: err });
          } else {
            console.log(data);
            console.log(shoppingCart);
            ShoppingCart.findByIdAndUpdate(
              shoppingCart._id,
              {
                $push: {
                  listProductOrder: data._id,
                },
              },
              (err, hihi) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(hihi);
                }
              }
            );
          }
        });
      } else {
        const productOrder = await ProductOrder.findById(id);
        let count = productOrder.quantity;
        await ProductOrder.findByIdAndUpdate(id, {
          quantity: count + 1,
        });
      }

      console.log(session);
    } else {
      const session = await Session.findOne({ idUser: req.session.unauthId });
      const shoppingCart = await ShoppingCart.findById(session.idShoppingCart);
      await User.findOneAndUpdate(
        { email: req.user.email },
        {
          idShoppingCart: shoppingCart._id,
        }
      );
      let listProductOrder = [];
      for await (let idProductOrder of shoppingCart.listProductOrder) {
        let productOrder = await ProductOrder.findById(idProductOrder);
        listProductOrder.push(productOrder);
      }
      let id = await containsProduct(idProduct, listProductOrder);
      if (id === null) {
        const productOrder = new ProductOrder({
          idProduct: idProduct,
          quantity: 1,
        });
        await productOrder.save((err, data) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ result: "failed", message: err });
          } else {
            console.log(data);
            console.log(shoppingCart);
            ShoppingCart.findByIdAndUpdate(
              shoppingCart._id,
              {
                $push: {
                  listProductOrder: data._id,
                },
              },
              (err, hihi) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(hihi);
                }
              }
            );
          }
        });
      } else {
        const productOrder = await ProductOrder.findById(id);
        let count = productOrder.quantity;
        await ProductOrder.findByIdAndUpdate(id, {
          quantity: count + 1,
        });
      }
      console.log(req.user);
    }
    return res.status(200).json({
      result: "ok",
    });
  },
  getShoppingCart: function (req, res) {},
};
function containsProduct(idProduct, list) {
  for (let item of list) {
    if (item.idProduct === idProduct) {
      return item._id;
    }
  }
  return null;
}
