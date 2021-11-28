const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");
const utilsPagination = require("../utils/pagination");
const utilsAddUrlProduct = require("../utils/getUrlProduct");
// const path = require("path");
// const express = require("express");
// const app = express();

class ProductController {
  //[Get] /
  async index(req, res, next) {
    //res.render('shop-grid/shop-grid');
    var perPage = 6,
      page = Math.max(parseInt(req.param("page")) || 1, 1);
    if (req.param("page") == null) {
      page = 1;
    }

    let products = await Product.find({})
      .skip(perPage * (page - 1))
      .limit(perPage);

    let size = await Product.count({});

    let categories = await Category.find({});
    var leftPage = await utilsPagination.getLeftPage("/shop-grid", page);
    var pagination = await utilsPagination.getPagination("/shop-grid", page);
    var rightPage = await utilsPagination.getRightPage("/shop-grid", page);
    //productProMax = utils.mutipleMongooseToObject(products);
    let listProducts = await utilsAddUrlProduct.AddUrlProduct(products);
    res.render("shop-grid/shop-grid", {
      products: listProducts,
      size: size,
      currentPage: page,
      category: utils.mutipleMongooseToObject(categories),
      pagination: pagination,
      leftPage: leftPage,
      rightPage: rightPage,
    });
  }

  async seachByCategory(req, res, next) {
    // console.log(path.join(__dirname, "../public"));
    // app.use(express.static(path.join(__dirname, "../public")));
    //res.render("home/home");

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
    let listProducts = await utilsAddUrlProduct.AddUrlProduct(products);
    // res.send(tmp);

    res.render("shop-grid/shop-grid", {
      products: listProducts,
      size: size,
      currentPage: page,
      category: utils.mutipleMongooseToObject(categories),
      idCategory: req.params.idCategory,
      pagination: pagination,
      leftPage: leftPage,
      rightPage: rightPage,
    });
  }

  async getProduct(req, res, next) {
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

    //res.send(arr);
    //res.send(categoryChoose);

    let relatedProduct = await Product.find({
      _id: { $in: categoryChoose.listIdProduct },
    })
      .skip(0)
      .limit(6);

    await res.render("shop-details/shop-details", {
      product: utils.mutipleMongooseToObject(new Array(productChoose)),
      category: utils.mutipleMongooseToObject(new Array(categoryChoose)),
      relatedProduct: utils.mutipleMongooseToObject(relatedProduct),
    });
  }
}

module.exports = new ProductController();
