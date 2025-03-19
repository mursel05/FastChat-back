const { WebSocketServer } = require("ws");

const wsPort = process.env.WS_PORT;
const wss = new WebSocketServer({ port: wsPort }, (err) => {
  if (err) {
    console.log("WebSocketServer error", err);
  } else {
    console.log("WebSocketServer is running on", wsPort);
  }
});

module.exports = wss;
