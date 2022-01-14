const Session = require("../../models/Session");
const ShoppingCart = require("../../models/ShoppingCart");
const ProductOrder = require("../../models/ProductOrder");
const User = require("../../models/User");
const Product = require("../../models/Product");

module.exports = {
  addShoppingCart: async (req, res) => {
    const { idProduct, numProductOder } = req.body;
    console.log(idProduct);
    console.log(req.session.unauthId);
    //const newSession = new Session()
    const product = await Product.findOne({ idProduct: idProduct });
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
          image: product.image,
          name: product.name,
          unitPrice: product.price,
          quantity: parseInt(numProductOder),
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
          quantity: count + parseInt(numProductOder),
        });
      }
    } else {
      const user = await User.findOne({ email: req.user.email });
      const shoppingCart = await ShoppingCart.findById(user.idShoppingCart);

      let listProductOrder = [];
      for await (let idProductOrder of shoppingCart.listProductOrder) {
        let productOrder = await ProductOrder.findById(idProductOrder);
        listProductOrder.push(productOrder);
      }
      let id = await containsProduct(idProduct, listProductOrder);
      if (id === null) {
        const productOrder = new ProductOrder({
          idProduct: idProduct,
          image: product.image,
          name: product.name,
          unitPrice: product.price,
          quantity: parseInt(numProductOder),
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
          quantity: count + parseInt(numProductOder),
        });
      }
      console.log(req.user);
    }
    return res.status(200).json({
      result: "Ok",
    });
  },
  getShoppingCart: async function (req, res) {
    if (!req.user) {
      const session = await Session.findOne({ idUser: req.session.unauthId });
      let shoppingCart;
      if (session != null) {
        shoppingCart = await ShoppingCart.findById(session.idShoppingCart);
      } else {
        return res.status(200).json({
          result: "No product order found",
          data: [{}],
        });
      }
      let listProductOrder = [];
      for await (let idProductOrder of shoppingCart.listProductOrder) {
        let productOrder = await ProductOrder.findById(idProductOrder);
        listProductOrder.push(productOrder);
      }

      return res.status(200).json({
        result: "Ok",
        data: listProductOrder,
      });
    } else {
      const user = await User.findOne({ email: req.user.email });
      const shoppingCartUser = await ShoppingCart.findById(user.idShoppingCart);
      let listProductOrder = [];
      for await (let idProductOrder of shoppingCartUser.listProductOrder) {
        let productOrder = await ProductOrder.findById(idProductOrder);
        listProductOrder.push(productOrder);
      }

      return res.status(200).json({
        result: "Ok",
        data: listProductOrder,
      });
    }
  },
  putRemoveProductOder: async (req, res) => {
    const { idProductOrder } = req.body;
    if (!req.user) {
      try {
        const session = await Session.findOne({ idUser: req.session.unauthId });
        const shoppingCart = await ShoppingCart.findByIdAndUpdate(
          session.idShoppingCart,
          {
            $pull: {
              listProductOrder: idProductOrder,
            },
          }
        );
        await ProductOrder.findOneAndDelete(idProductOrder);
        res.status(200).json({ result: "Success" });
      } catch (error) {
        res.status(400).json({ result: "Failed" });
      }
    } else {
      try {
        const shoppingCart = await ShoppingCart.findOneAndUpdate(
          req.user.email,
          {
            $pull: {
              listProductOrder: idProductOrder,
            },
          }
        );
        await ProductOrder.findOneAndDelete(idProductOrder);
        res.status(200).json({ result: "Success" });
      } catch (error) {
        res.status(400).json({ result: "Failed" });
      }
    }
  },
  putUpdateShoppingCart: async (req, res) => {
    console.log(req.body);
    const { listProductOrder } = req.body;
    console.log(listProductOrder);
    try {
      for await (let item of listProductOrder) {
        await ProductOrder.findByIdAndUpdate(item.name, {
          quantity: parseInt(item.value),
        });
      }
      res.status(200).json({ result: "Successfully update shopping cart" });
    } catch (error) {
      res.status(400).json({ result: "Failed to update shopping cart" });
    }
  },
};
function containsProduct(idProduct, list) {
  if (list.length <= 0) {
    return null;
  }
  for (let item of list) {
    if (item.idProduct === idProduct) {
      return item._id;
    }
  }
  return null;
}
