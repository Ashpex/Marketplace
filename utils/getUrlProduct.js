const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");

module.exports = {
  async AddUrlProduct(products) {
    let listProductWithUrl = [];
    for (const product of products) {
      //console.log(product.category);
      let category = await Category.findOne({ name: product.category });
      //console.log(category);
      let tmp = utils.mongooseToObject(product);
      tmp.url =
        "/shop-grid" + "/" + category.idCategory + "/" + product.idProduct;
      listProductWithUrl.push(tmp);
      //console.log(tmp);
    }
    //console.log(listProductWithUrl);
    return listProductWithUrl;
  },
};
