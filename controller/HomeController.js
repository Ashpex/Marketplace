const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");
const mongoose = require("mongoose");
const productController = require("./ProductController");

module.exports = {
  index: async (req, res, next) => {
    const categories = await Category.find({});
    res.render("home/home", {
      category: utils.mutipleMongooseToObject(categories),
    });
  },
};
