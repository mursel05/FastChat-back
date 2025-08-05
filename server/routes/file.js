const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const { publicUpload, privateUpload } = require("../utils/storage");
const { authenticate } = require("../middlewares/auth");

router.post(
  "/:chatId",
  authenticate,
  privateUpload.single("file"),
  fileController.addFile
);
router.post(
  "/",
  authenticate,
  publicUpload.single("file"),
  fileController.addFile
);
router.get("/:chatId/:filename", authenticate, fileController.getFile);

module.exports = router;
