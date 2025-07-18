const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authenticate } = require("../middlewares/auth");

router.post("/", authenticate, messageController.sendMessage);
router.get("/:chatId", authenticate, messageController.getMessages);
router.delete("/:messageId", authenticate, messageController.deleteMessage);
router.post("/seen-message", authenticate, messageController.seenMessage);

module.exports = router;
