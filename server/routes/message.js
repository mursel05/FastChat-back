const messageController = require("../controllers/messageController");
const { authenticate } = require("../middlewares/auth");
const { wrapExpressHandler } = require("../utils/expressWrapper");

async function routes(fastify, options) {
  fastify.post("/", { preHandler: authenticate }, wrapExpressHandler(messageController.sendMessage));
  fastify.get("/:chatId", { preHandler: authenticate }, wrapExpressHandler(messageController.getMessages));
  fastify.delete("/:messageId", { preHandler: authenticate }, wrapExpressHandler(messageController.deleteMessage));
  fastify.post("/seen-message", { preHandler: authenticate }, wrapExpressHandler(messageController.seenMessage));
}

module.exports = routes;
