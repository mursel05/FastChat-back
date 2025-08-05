const Chat = require("../models/chat");
const fs = require("fs");
const path = require("path");

exports.addFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(404)
        .json({ success: false, message: "No file uploaded" });
    }
    res.status(201).json({
      success: true,
      data: {
        fileType: req.fileType,
        filePath: req.filePath,
        fileName: req.file.originalname,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.getFile = async (req, res) => {
  try {
    const { chatId, filename } = req.params;
    const chat = await Chat.findOne({ id: chatId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    if (!chat.persons.some((person) => person.userId === req.userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this chat",
      });
    }
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid filename" });
    }
    const filePath = path.join("uploads", chatId, filename);
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};
