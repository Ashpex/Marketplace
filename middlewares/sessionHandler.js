const ShoppingCart = require("../models/ShoppingCart");
const Session = require("../models/Session");

const { uuid } = require("uuidv4");
module.exports = async function (req, res, next) {
    if (!req.session.unauthId) {
        req.session.unauthId = uuid();
        const shoppingCart = await new ShoppingCart({
            listProductOrder: [],
            status: false,
            purchasedTime: new Date().toLocaleString(),
        });
        shoppingCart.save(async (err, data) => {
            if (err) {
                console.log(err);
                res.render("errors/500", { error: err });
            } else {
                const session = await new Session({
                    idUser: req.session.unauthId,
                    idShoppingCart: data._id,
                });
                session.save((err) => {
                    if (err) {
                        console.log(err);
                        res.render("errors/500", { error: err });
                    }
                });
            }
        });
    }
    next();
};
