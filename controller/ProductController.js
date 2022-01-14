const Product = require("../models/Product");
const Category = require("../models/Category");
const Rating = require("../models/Rating");
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
      page,Q
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

    let perPage = 6,
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

    let sizePage = Math.max(parseInt(size / perPage + 1));
    console.log(sizePage);
    let categories = await Category.find({});

    let leftPage = await utilsPagination.getLeftPage(
      "/shop-grid/" + req.params.idCategory,
      page,
      sizePage
    );
    let pagination = await utilsPagination.getPagination(
      "/shop-grid/" + req.params.idCategory,
      page,
      sizePage
    );
    let rightPage = await utilsPagination.getRightPage(
      "/shop-grid/" + req.params.idCategory,
      page,
      sizePage
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

  //[Get] /search?name=&minPrice=129492+đ&maxPrice=442203+đ
  searchProduct: async (req, res, next) => {
    const name = req.param("name");
    let flag = false;
    let products = null;
    let minPrice = 0;
    let maxPrice = 0;
    let size = 0;
    let leftPage = 0;
    let pagination = 0;
    let rightPage = 0;
    let sizePage = 0;

    let perPage = 6,
      page = Math.max(parseInt(req.param("page")) || 1, 1);
    if (req.param("page") == null) {
      page = 1;
    }

    if (req.query.minPrice && req.query.maxPrice) {
      flag = true;
      minPrice = req.param("minPrice").slice(0, req.query.minPrice.length - 2);
      maxPrice = req.param("maxPrice").slice(0, req.query.maxPrice.length - 2);
    }
    if (flag) {
      products = await Product.find({
        name: { $regex: name, $options: "i" },
        price: { $gte: minPrice, $lte: maxPrice },
      })
        .skip(perPage * (page - 1))
        .limit(perPage);
      size = await Product.count({
        name: { $regex: name, $options: "i" },
        price: { $gte: minPrice, $lte: maxPrice },
      });
      sizePage = Math.max(parseInt(size / perPage + 1));
      console.log(sizePage);
      leftPage = await utilsPagination.getLeftPageSearch(
        "/shop-grid/search?name=" +
          req.param("name") +
          "&minPrice=" +
          req.param("minPrice").replace(" ", "+") +
          "&maxPrice=" +
          req.param("maxPrice").replace(" ", "+"),
        page,
        sizePage
      );
      pagination = await utilsPagination.getPaginationSearch(
        "/shop-grid/search?name=" +
          req.param("name") +
          "&minPrice=" +
          req.param("minPrice").replace(" ", "+") +
          "&maxPrice=" +
          req.param("maxPrice").replace(" ", "+"),
        page,
        sizePage
      );
      rightPage = await utilsPagination.getRightPageSearch(
        "/shop-grid/search?name=" +
          req.param("name") +
          "&minPrice=" +
          req.param("minPrice").replace(" ", "+") +
          "&maxPrice=" +
          req.param("maxPrice").replace(" ", "+"),
        page,
        sizePage
      );
    } else {
      products = await Product.find({
        name: { $regex: name, $options: "i" },
      })
        .skip(perPage * (page - 1))
        .limit(perPage);
      size = await Product.count({
        name: { $regex: name, $options: "i" },
      });
      sizePage = Math.max(parseInt(size / perPage + 1));
      console.log(sizePage);
      leftPage = await utilsPagination.getLeftPageSearch(
        "/shop-grid/search?name=" + req.param("name"),
        page,
        sizePage
      );
      pagination = await utilsPagination.getPaginationSearch(
        "/shop-grid/search?name=" + req.param("name"),
        page,
        sizePage
      );
      rightPage = await utilsPagination.getRightPageSearch(
        "/shop-grid/search?name=" + req.param("name"),
        page,
        sizePage
      );
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
      pagination: pagination,
      leftPage: leftPage,
      rightPage: rightPage,
    });
  },
};
