const express = require("express");
const router = express.Router();

const homeController = require("../controller/HomeController");

// productController.index
router.get("/", homeController.index);

module.exports = router;
