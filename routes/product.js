const express = require("express");
const router = express.Router();

const productController = require("../controller/ProductController");

router.get("/search", productController.searchProduct);

router.get("/:idCategory", productController.seachByCategory);

router.get("/:idCategory/:idProduct", productController.getProduct);
// productController.index
router.get("/", productController.index);

module.exports = router;
