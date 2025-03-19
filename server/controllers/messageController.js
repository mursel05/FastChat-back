const Chat = require("../models/chat");
const Message = require("../models/message");
const { userMessaged, userSeen } = require("./wsController");

exports.sendMessage = async (req, res) => {
  try {
    const chat = await Chat.findOne({ id: req.body.chatId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    const newMessage = Message({
      id: req.body.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatId: req.body.chatId,
      sender: req.userId,
      message: req.body.message,
      mediaUrl: req.body.mediaUrl,
      messageType: req.body.messageType,
      deleteMessage: [],
      seen: [],
      reactions: [],
      sent: true,
    });
    await newMessage.save();
    userMessaged(newMessage.toObject(), chat.persons);
    res.status(201).json({ success: true, data: newMessage.toObject() });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.messageId });
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    await Message.findOneAndUpdate(
      {
        id: req.params.messageId,
      },
      {
        $push: {
          deleteMessage: req.userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.seenMessage = async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.body.messageId });
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    if (message.sender === req.userId) {
      return res.status(403).json({
        success: false,
        message: "You can't mark your own message as seen",
      });
    }
    if (message.seen.find((seen) => seen.userId === req.userId)) {
      return res.status(200).json({ success: true });
    }
    const updatedMessage = await Message.findOneAndUpdate(
      {
        id: req.body.messageId,
      },
      {
        $push: {
          seen: {
            userId: req.userId,
            seenAt: new Date(),
          },
        },
      },
      { new: true }
    );
    userSeen(updatedMessage.toObject());
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};
