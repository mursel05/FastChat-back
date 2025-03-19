const WebSocket = require("ws");
const wssData = require("../config/wssData");
const User = require("../models/user");

exports.userConnected = async (wss, ws, userId) => {
  const message = JSON.stringify({
    type: "lastSeen",
    data: { id: userId, lastSeen: "online" },
  });
  wssData.users.push({
    ws,
    id: userId,
  });
  await User.findOneAndUpdate({ id: userId }, { lastSeen: "online" });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

exports.userDisconnected = async (wss, userId) => {
  const message = JSON.stringify({
    type: "lastSeen",
    data: { id: userId, lastSeen: new Date().toISOString() },
  });
  wssData.users.forEach((user, index) => {
    if (user.id === userId) {
      wssData.users.splice(index, 1);
    }
  });
  await User.findOneAndUpdate(
    { id: userId },
    { lastSeen: new Date().toISOString() }
  );
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

exports.userErrored = (ws) => {
  const message = JSON.stringify({
    type: "error",
    message: "Something went wrong",
  });
  ws.send(message);
  ws.close(1011, "Internal Error");
};

exports.userMessaged = async (message, persons) => {
  const messageString = JSON.stringify({
    type: "message",
    data: message,
  });
  wssData.users.forEach(
    (user) =>
      persons.some((person) => person.userId === user.id) &&
      user.ws.send(messageString)
  );
};

exports.userSeen = async (message) => {
  const messageString = JSON.stringify({
    type: "seen",
    data: message,
  });
  wssData.users.forEach((user) => user.id === user.ws.send(messageString));
};
