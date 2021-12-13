const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");
const utilsPagination = require("../utils/pagination");
const utilsAddUrlProduct = require("../utils/getUrlProduct");

module.exports = {
  //[Get] /
  index: async (req, res, next) => {
    let perPage = 6,
      page = Math.max(parseInt(req.param("page")) || 1, 1);
    if (req.param("page") == null) {
      page = 1;
    }

    let products = await Product.find({})
      .skip(perPage * (page - 1))
      .limit(perPage);

    let size = await Product.count({});
    let sizePage = Math.max(parseInt(size / perPage + 1));

    let categories = await Category.find({});
    var leftPage = await utilsPagination.getLeftPage(
      "/shop-grid",
      page,
      sizePage
    );
    var pagination = await utilsPagination.getPagination(
      "/shop-grid",
      page,
      sizePage
    );
    var rightPage = await utilsPagination.getRightPage(
      "/shop-grid",
      page,
      sizePage
    );

    let latestProducts = await Product.find({});
    latestProducts = latestProducts.slice(0, 3);

    res.render("shop-grid/shop-grid", {
      products: utils.mutipleMongooseToObject(products),
      size: size,
      currentPage: page,
      category: utils.mutipleMongooseToObject(categories),
      pagination: pagination,
      leftPage: leftPage,
      rightPage: rightPage,
      latestProducts: utils.mutipleMongooseToObject(latestProducts),
    });
  },
  //[Get] /:idCategroy
  seachByCategory: async (req, res, next) => {
    let categoryChoose = await Category.findOne({
      idCategory: req.params.idCategory,
    });

    if (categoryChoose == null) {
      res.redirect("/shop-grid");
      return;
    }

    var perPage = 6,
      page = Math.max(parseInt(req.param("page")) || 1, 1);
    if (req.param("page") == null) {
      page = 1;
    }

    let products = await Product.find({
      _id: { $in: categoryChoose.listIdProduct },
    })
      .skip(perPage * (page - 1))
      .limit(perPage);

    let size = await Product.count({
      _id: { $in: categoryChoose.listIdProduct },
    });

    let categories = await Category.find({});

    let leftPage = await utilsPagination.getLeftPage(
      "/shop-grid/" + req.params.idCategory,
      page
    );
    let pagination = await utilsPagination.getPagination(
      "/shop-grid/" + req.params.idCategory,
      page
    );
    let rightPage = await utilsPagination.getRightPage(
      "/shop-grid/" + req.params.idCategory,
      page
    );

    let latestProducts = await Product.find({
      _id: { $in: categoryChoose.listIdProduct },
    });
    latestProducts = latestProducts.slice(0, 3);

    res.render("shop-grid/shop-grid", {
      products: utils.mutipleMongooseToObject(products),
      size: size,
      currentPage: page,
      category: utils.mutipleMongooseToObject(categories),
      idCategory: req.params.idCategory,
      pagination: pagination,
      leftPage: leftPage,
      rightPage: rightPage,
      latestProducts: utils.mutipleMongooseToObject(latestProducts),
    });
  },

  //[Get] /:idCategroy/:idProduct
  getProduct: async (req, res, next) => {
    let { idCategory } = req.params;
    let { idProduct } = req.params;

    let categoryChoose = await Category.findOne({
      idCategory: idCategory,
    });

    let productChoose = await Product.findOne({
      idProduct: idProduct,
    });

    if (categoryChoose == null || productChoose == null) {
      res.redirect("/shop-grid");
      return;
    }

    let relatedProduct = await Product.find({
      _id: { $in: categoryChoose.listIdProduct },
    })
      .skip(0)
      .limit(6);

    const categories = await Category.find({});
    await res.render("shop-details/shop-details", {
      product: utils.mutipleMongooseToObject(new Array(productChoose)),
      category: utils.mutipleMongooseToObject(new Array(categoryChoose)),
      relatedProduct: utils.mutipleMongooseToObject(relatedProduct),
      listCategory: utils.mutipleMongooseToObject(categories),
    });
  },
  searchProduct: async (req, res, next) => {
    const name = req.query.name;
    let flag = false;
    let products = null;
    let minPrice = 0;
    let maxPrice = 0;
    let size = 0;

    if (req.query.minPrice && req.query.maxPrice) {
      flag = true;
      minPrice = req.query.minPrice.slice(0, req.query.minPrice.length - 2);
      maxPrice = req.query.maxPrice.slice(0, req.query.maxPrice.length - 2);
    }
    if (flag) {
      products = await Product.find({
        name: { $regex: name, $options: "i" },
        price: { $gte: minPrice, $lte: maxPrice },
      });
      size = await Product.count({
        name: { $regex: name, $options: "i" },
        price: { $gte: minPrice, $lte: maxPrice },
      });
    } else {
      products = await Product.find({
        name: { $regex: name, $options: "i" },
      });
      size = await Product.count({
        name: { $regex: name, $options: "i" },
      });
    }

    const categories = await Category.find({});

    let latestProducts = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    latestProducts = latestProducts.slice(0, 3);

    res.render("shop-grid/shop-grid", {
      products: utils.mutipleMongooseToObject(products),
      size: size,
      category: utils.mutipleMongooseToObject(categories),
      name,
      latestProducts: utils.mutipleMongooseToObject(latestProducts),
    });
  },
};
