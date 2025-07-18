const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh-tokens", userController.refreshTokens);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.put("/", authenticate, userController.updateUser);
router.get("/:email", authenticate, userController.getUserByEmail);
router.get("/id/:id", authenticate, userController.getUserById);
router.get("/:email", authenticate, userController.getUserByEmail);
router.get("/", authenticate, userController.getUser);

module.exports = router;
