const express = require("express");
const router = express.Router();

const productController = require("../controller/ProductController");

router.get("/:idCategory", productController.seachByCategory);
// productController.index
router.get("/:idCategory/:idProduct", productController.getProduct);

router.get("/", productController.index);

module.exports = router;
