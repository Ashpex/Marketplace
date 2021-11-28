const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");
const mongoose = require("mongoose");
const productController = require("./ProductController");

class HomeController {
  //[Get] /
  async index(req, res, next) {
    res.render("home/home");
  }
}

module.exports = new HomeController();
