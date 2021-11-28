const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");
const utilsPagination = require("../utils/pagination");
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

    Product.find({})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .then(async (products) => {
        let size = await Product.count({});

        let categories = await Category.find({});
        var leftPage = utilsPagination.getLeftPage("/shop-grid", page);
        var pagination = utilsPagination.getPagination("/shop-grid", page);
        var rightPage = utilsPagination.getRightPage("/shop-grid", page);
        //productProMax = utils.mutipleMongooseToObject(products);

        res.render("shop-grid/shop-grid", {
          products: utils.mutipleMongooseToObject(products),
          size: size,
          currentPage: page,
          category: utils.mutipleMongooseToObject(categories),
          pagination: pagination,
          leftPage: leftPage,
          rightPage: rightPage,
        });
        //res.json(categories);
      })
      .catch(next);
  }

  async seachByCategory(req, res, next) {
    // console.log(path.join(__dirname, "../public"));
    // app.use(express.static(path.join(__dirname, "../public")));
    //res.render("home/home");

    var categoryChoose = await Category.findOne({
      idCategory: req.params.idCategory,
    });

    if (categoryChoose == null) {
      res.redirect("/shop-grid");
      return;
    }

    //res.send(utils.mongooseToObject(categoryChoose));
    //chua fix

    var perPage = 6,
      page = Math.max(parseInt(req.param("page")) || 1, 1);
    if (req.param("page") == null) {
      page = 1;
    }

    Product.find({ _id: { $in: categoryChoose.listIdProduct } })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .then(async (products) => {
        var size = 0;
        await Product.count({
          _id: { $in: categoryChoose.listIdProduct },
        }).then((numOfProducts) => {
          size = numOfProducts;
        });

        var categories;
        await Category.find({}).then((category) => {
          categories = category;
        });

        var leftPage = utilsPagination.getLeftPage(
          "/shop-grid/" + req.params.idCategory,
          page
        );
        var pagination = utilsPagination.getPagination(
          "/shop-grid/" + req.params.idCategory,
          page
        );
        var rightPage = utilsPagination.getRightPage(
          "/shop-grid/" + req.params.idCategory,
          page
        );

        res.render("shop-grid/shop-grid", {
          products: utils.mutipleMongooseToObject(products),
          size: size,
          currentPage: page,
          category: utils.mutipleMongooseToObject(categories),
          idCategory: req.params.idCategory,
          pagination: pagination,
          leftPage: leftPage,
          rightPage: rightPage,
        });
        //res.json(categories);
      })
      .catch(next);
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
