const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = path.join("public", req.userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${uuidv4()}-${file.originalname}`;
    req.fileType = file.mimetype;
    const protocol = req.protocol;
    const host = req.get("host");
    req.filePath = `${protocol}://${host}/public/${req.userId}/${fileName}`;
    cb(null, fileName);
  },
});

exports.upload = multer({ storage });
