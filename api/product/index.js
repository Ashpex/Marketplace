const {Router} = require('express');
const router = Router();

const apiProductController = require("./apiProductController");

router.post("/rate", apiProductController.rate);
module.exports = router;
