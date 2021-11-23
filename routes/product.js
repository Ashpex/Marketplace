const express = require("express");
const router = express.Router();

const productController = require("../controller/ProductController");

// productController.index
router.get("/", productController.index);

router.get("/:slug", productController.searchByCategory);

module.exports = router;
