const Product = require("../models/Product");
const utils = require("../utils/mongoose");

class ProductController {
  //[Get] /
  async index(req, res, next) {
    //res.render('shop-grid/shop-grid');
    var perPage = 6,
      page = await Math.max(0, req.param("page"));
    if (req.param("page") == null) {
      page = 0;
    }

    var listCategory;
    await Product.find({}).then(async (products) => {
      listCategory = await utils.getListCategory(products);
    });

    Product.find({})
      .skip(perPage * page)
      .limit(perPage)
      .then(async (products) => {
        var size = 0;
        await Product.count({}).then((numOfProducts) => {
          size = numOfProducts;
          //numPage = size / perPage;
        });

        res.render("shop-grid/shop-grid", {
          products: utils.mutipleMongooseToObject(products),
          size: size,
          currentPage: page,
          category: listCategory,
        });
      })
      .catch(next);
  }

  searchByCategory(req, res, next) {}
}

module.exports = new ProductController();
