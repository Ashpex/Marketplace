const User = require("../models/User");
const Session = require("../models/Session");
const ShoppingCart = require("../models/ShoppingCart");
const ProductOrder = require("../models/ProductOrder");

module.exports = async function (req, res, next) {
    if (req.user) {
        const session = await Session.findOne({ idUser: req.session.unauthId });
        let shoppingCart;
        if (session != null) {
            shoppingCart = await ShoppingCart.findById(session.idShoppingCart);
        }
        const user = await User.findOne({ email: req.user.email });

        if (!user.idShoppingCart & (session != null)) {
            await User.findOneAndUpdate(
                { email: req.user.email },
                {
                    idShoppingCart: shoppingCart._id,
                }
            );
            await Session.findByIdAndDelete(session._id);
        } else if (session != null) {
            try {
                const shoppingCartUser = await ShoppingCart.findById(
                    user.idShoppingCart
                );
                if (shoppingCartUser == null) {
                    await User.findOneAndUpdate(
                        { email: req.user.email },
                        {
                            idShoppingCart: shoppingCart._id,
                        }
                    );
                    await Session.findByIdAndDelete(session._id);
                    return;
                }
                let newData = await checkDataShoppingCart(
                    shoppingCart,
                    shoppingCartUser
                );

                let result = newData.map((a) => a._id);
                for await (let productOrder of newData) {
                    await ProductOrder.findByIdAndUpdate(productOrder._id, {
                        quantity: productOrder.quantity,
                    });
                }
                await ShoppingCart.findByIdAndUpdate(user.idShoppingCart, {
                    listProductOrder: result,
                });
                await Session.findByIdAndDelete(session._id);
            } catch (err) {
                console.log(err);
            }
        }
    }
    next();
};

async function checkDataShoppingCart(shoppingCart, shoppingCartUser) {
    let listProductOrder = [];
    for await (let idProductOrder of shoppingCart.listProductOrder) {
        let productOrder = await ProductOrder.findById(idProductOrder);
        listProductOrder.push(productOrder);
    }
    let listProductOrderUser = [];
    for await (let idProductOrderUser of shoppingCartUser.listProductOrder) {
        let productOrder = await ProductOrder.findById(idProductOrderUser);
        listProductOrderUser.push(productOrder);
    }
    newData = [];
    for await (let productOrder of listProductOrderUser) {
        let item = containsProduct(productOrder.idProduct, listProductOrder);
        if (item != null) {
            item.quantity += productOrder.quantity;
            newData.push(item);
        } else {
            newData.push(productOrder);
        }
    }

    for await (let productOrder of listProductOrder) {
        let item = containsProduct(productOrder.idProduct, newData);
        if (item == null) {
            newData.push(productOrder);
        }
    }
    let dataDelete = [];
    for await (let productOrder of listProductOrderUser) {
        let item = containsProduct(productOrder.idProduct, newData);
        if (item == null) {
            dataDelete.push(productOrder);
        }
    }
    for await (let productOrder of listProductOrder) {
        let item = containsProduct(productOrder.idProduct, newData);
        if (item == null) {
            dataDelete.push(productOrder);
        }

        for await (let productOrder of dataDelete) {
            await ProductOrder.findByIdAndDelete(productOrder._id);
        }
    }

    return newData;
}
function containsProduct(idProduct, list) {
    for (let item of list) {
        if (item.idProduct === idProduct) {
            return item;
        }
    }
    return null;
}