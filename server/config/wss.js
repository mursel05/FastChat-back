const { WebSocketServer } = require("ws");
const webSocket = require("../routes/webSocket");

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("error", (err) => {
    console.log("WebSocketServer error", err);
  });
  wss.on("connection", (ws, req) => {
    webSocket(wss, ws, req);
  });
}

module.exports = setupWebSocket;
