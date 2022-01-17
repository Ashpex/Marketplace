const ShoppingCart = require("../models/ShoppingCart");
const ProductOrder = require("../models/ProductOrder");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Product = require("../models/Product");
const CheckOut = require("../models/CheckOut");
const env = require("dotenv").config();

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
            let productOrder = await ProductOrder.findById(
                idProductOrder
            ).lean();

            productOrder.sumPriceProduct =
                productOrder.quantity * productOrder.unitPrice;
            sumPrice += productOrder.sumPriceProduct;
            listProductOrder.push(productOrder);
        }

        const errorNumberPhone = req.query.error;
        const errorListProduct = req.query.errorListProduct;
        res.render("checkout/checkout", {
            listProductOrder: listProductOrder,
            sumPrice: sumPrice,
            errorNumberPhone: errorNumberPhone,
            errorListProduct: errorListProduct,
            admin_url: process.env.ADMIN_URL,
        });
    },
    postCheckOut: async (req, res) => {
        const { numberPhone, emailUser, note } = req.body;
        if (!numberPhone || !validate(numberPhone)) {
            res.redirect("/checkout?error=numberPhone");
            return;
        }

        const user = await User.findOne({ email: req.user.email });
        const shoppingCartUser = await ShoppingCart.findById(
            user.idShoppingCart
        );
        if (shoppingCartUser.listProductOrder.length <= 0) {
            res.redirect("/checkout?errorListProduct=errorListProduct");
            return;
        }
        const newCheckOut = new CheckOut({
            email: req.user.email,
            numberPhone: numberPhone,
            idShoppingCart: user.idShoppingCart,
            note: note,
            status: "Pending",
        });

        await newCheckOut.save((err) => {
            if (err) {
                console.log(err);
            }
        });
        const newShoppingCart = await new ShoppingCart({
            listProductOrder: [],
            status: false,
            purchasedTime: new Date().toLocaleString(),
        });
        await newShoppingCart.save(async (err, data) => {
            if (err) {
                console.log(err);
            } else {
                try {
                    await User.findOneAndUpdate(
                        { email: req.user.email },
                        {
                            idShoppingCart: data._id,
                            $addToSet: {
                                listIdShoppingCartHistory: user.idShoppingCart,
                            },
                        }
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        });

        await Notification.create({
            title: "Đặt hàng",
            content: `Khách hàng ${req.body.name} đã đặt hàng`,
            time: new Date().toLocaleString(),
            seen: false,
        });

        return res.redirect("/home");
    },
};
function validate(phone) {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(phone);
}
