const Chat = require("../models/chat");
const { v4: uuidv4 } = require("uuid");
const Message = require("../models/message");

exports.addChat = async (req, res) => {
  try {
    const newChat = await Chat.create({
      id: uuidv4(),
      isGroup: req.body.isGroup,
      chatName: req.body.chatName,
      chatPhoto: req.body.chatPhoto,
      createdBy: req.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      persons: [
        ...req.body.persons.map((person) => ({
          userId: person,
          role: "member",
          joinedAt: new Date(),
          deleteChat: false,
        })),
        {
          userId: req.userId,
          role: "admin",
          joinedAt: new Date(),
          deleteChat: false,
        },
      ],
    });
    res
      .status(201)
      .json({ success: true, data: { ...newChat.toObject(), messages: [] } });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ "persons.userId": req.userId });
    const unSeenMessages = await Promise.all(
      chats.map(
        async (chat) =>
          (
            await Message.find({
              chatId: chat.id,
              "seen.userId": { $ne: req.userId },
              sender: { $ne: req.userId },
            })
          ).length
      )
    );
    const chatsWithMessages = await Promise.all(
      chats.map(async (chat, index) => {
        const messages = await Message.find({ chatId: chat.id });
        return {
          ...chat.toJSON(),
          messages,
          unSeenMessages: unSeenMessages[index],
        };
      })
    );
    res.status(200).json({ success: true, data: chatsWithMessages });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ id: req.params.chatId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    await Chat.findOneAndUpdate(
      {
        id: req.params.chatId,
        "persons.userId": req.userId,
      },
      {
        $set: {
          "persons.$.deleteChat": true,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};
