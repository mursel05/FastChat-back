const chatController = require("../controllers/chatController");
const { authenticate } = require("../middlewares/auth");
const { wrapExpressHandler } = require("../utils/expressWrapper");

async function routes(fastify, options) {
  fastify.post("/", { preHandler: authenticate }, wrapExpressHandler(chatController.addChat));
  fastify.get("/:chatId", { preHandler: authenticate }, wrapExpressHandler(chatController.getChat));
  fastify.get("/", { preHandler: authenticate }, wrapExpressHandler(chatController.getChats));
  fastify.delete("/:chatId", { preHandler: authenticate }, wrapExpressHandler(chatController.deleteChat));
}

module.exports = routes;
