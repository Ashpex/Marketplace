const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");
const mongoose = require("mongoose");
const productController = require("./ProductController");

module.exports = {
  index: async (req, res, next) => {
    const categories = await Category.find({}).lean();

    let categoryData = categories;
    for (let i = 0; i < categoryData.length; i++) {
      categoryData[i].listProduct = [];
      for (let j = 0; j < categoryData[i].listIdProduct.length; j++) {
        let product = await Product.findById(
          categoryData[i].listIdProduct[j]
        ).lean();

        categoryData[i].listProduct.push(product);
        if (j === 3) {
          break;
        }
      }
    }

    res.render("home/home", {
      category: categories,
      categoryData: categoryData,
    });
  },
};
