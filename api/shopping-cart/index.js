const { Router } = require("express");
const router = Router();

const apiShoppingCartController = require("./apiShoppingCartController");

router.post("/addShoppingCart", apiShoppingCartController.addShoppingCart);
router.get("/:idUser", apiShoppingCartController.getShoppingCart);

module.exports = router;
