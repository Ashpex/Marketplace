const { Router } = require("express");
const router = Router();

const apiShoppingCartController = require("./apiShoppingCartController");

router.post("/addShoppingCart", apiShoppingCartController.addShoppingCart);
router.get("/getShoppingCart", apiShoppingCartController.getShoppingCart);
router.put(
  "/removeProductOder",
  apiShoppingCartController.putRemoveProductOder
);

router.put(
  "/updateShoppingCart",
  apiShoppingCartController.putUpdateShoppingCart
);

module.exports = router;