const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    required: true,
  },
});

const chatSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  isGroup: {
    type: Boolean,
    required: true,
  },
  chatName: {
    type: String,
  },
  chatPhoto: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
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
  persons: {
    type: [personSchema],
    required: true,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
