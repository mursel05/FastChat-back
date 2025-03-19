const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const { upload } = require("../utils/storage");
const { authenticate } = require("../middlewares/auth");

const uploadFile = () => upload.single("file");
// upload.array("files", 5);

router.post("/", authenticate, uploadFile(), fileController.addFile);

module.exports = router;
