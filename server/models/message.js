const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const seenSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  seenAt: {
    type: Date,
    required: true,
  },
});

const reactionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  reactionType: {
    type: String,
    required: true,
  },
});

const messageSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  createdAt: {
    type: Date,
    required: true,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
  },
  mediaUrl: {
    type: String,
  },
  fileName: {
    type: String,
  },
  sender: {
    type: String,
    required: true,
  },
  seen: {
    type: [seenSchema],
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },
  reactions: {
    type: [reactionSchema],
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  deleteMessage: {
    type: [String],
    required: true,
  },
  sent: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
