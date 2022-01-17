const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");

module.exports = {
    async AddUrlProduct(products) {
        let listProductWithUrl = [];
        for (const product of products) {
            let category = await Category.findOne({ name: product.category });
            let tmp = utils.mongooseToObject(product);
            tmp.url =
                "/shop-grid" +
                "/" +
                category.idCategory +
                "/" +
                product.idProduct;
            listProductWithUrl.push(tmp);
        }
        return listProductWithUrl;
    },
};
