const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticate } = require("../middlewares/auth");

router.post("/", authenticate, chatController.addChat);
router.get("/:chatId", authenticate, chatController.getChat);
router.get("/", authenticate, chatController.getChats);
router.delete("/:chatId", authenticate, chatController.deleteChat);

module.exports = router;
