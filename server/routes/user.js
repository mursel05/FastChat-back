const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");
const { wrapExpressHandler } = require("../utils/expressWrapper");

async function routes(fastify, options) {
  // Public routes
  fastify.post("/register", wrapExpressHandler(userController.register));
  fastify.post("/login", wrapExpressHandler(userController.login));
  fastify.post("/refresh-tokens", wrapExpressHandler(userController.refreshTokens));
  fastify.post("/forgot-password", wrapExpressHandler(userController.forgotPassword));
  fastify.post("/reset-password", wrapExpressHandler(userController.resetPassword));
  fastify.post("/google-login", wrapExpressHandler(userController.signInWithGoogle));
  fastify.post("/google-signup", wrapExpressHandler(userController.signUpWithGoogle));

  // Protected routes
  fastify.post("/logout", { preHandler: authenticate }, wrapExpressHandler(userController.logOut));
  fastify.put("/", { preHandler: authenticate }, wrapExpressHandler(userController.updateUser));
  fastify.get("/:email", { preHandler: authenticate }, wrapExpressHandler(userController.getUserByEmail));
  fastify.get("/id/:id", { preHandler: authenticate }, wrapExpressHandler(userController.getUserById));
  fastify.get("/", { preHandler: authenticate }, wrapExpressHandler(userController.getUser));
}

module.exports = routes;
