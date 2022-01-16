const express = require("express");
const router = express.Router();
const chatBotController = require("../controller/ChatBotController");

router.get("/webhook",chatBotController.getWebhook);
router.post("/webhook",chatBotController.postWebhook);

module.exports = router;