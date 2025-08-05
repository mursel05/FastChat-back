const fileController = require("../controllers/fileController");
const { authenticate } = require("../middlewares/auth");
const { wrapExpressHandler } = require("../utils/expressWrapper");
const { handlePublicUpload, handlePrivateUpload } = require("../utils/fileUpload");

async function routes(fastify, options) {
  // Private file upload (with chatId)
  fastify.post("/:chatId", {
    preHandler: [authenticate, handlePrivateUpload],
  }, wrapExpressHandler(fileController.addFile));

  // Public file upload
  fastify.post("/", {
    preHandler: [authenticate, handlePublicUpload],
  }, wrapExpressHandler(fileController.addFile));

  // Get file
  fastify.get("/:chatId/:filename", { preHandler: authenticate }, wrapExpressHandler(fileController.getFile));
}

module.exports = routes;
