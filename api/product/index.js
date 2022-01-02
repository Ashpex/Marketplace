const { Router } = require("express");
const router = Router();

const apiProductController = require("./apiProductController");

router.post("/rate", apiProductController.rate);
router.get("/:productId/ratings", apiProductController.getRatings);

module.exports = router;
