const express = require("express");
const router = express.Router();

const checkOutController = require("../controller/CheckOutController");

router.get("/", checkOutController.getIndex);
router.post("/", checkOutController.postCheckOut);

module.exports = router;
