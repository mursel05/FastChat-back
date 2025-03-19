const { verifyAccessToken } = require("../controllers/tokenController");
const {
  userConnected,
  userDisconnected,
  userErrored,
} = require("../controllers/wsController");
const cookie = require("cookie");

const webSocket = (wss, ws, req) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const accessToken = cookies.accessToken;
  const decoded = verifyAccessToken(accessToken);
  if (!decoded) {
    ws.close(1008, "Unauthorized");
    return;
  }
  userConnected(wss, ws, decoded.sub);
  ws.on("close", () => userDisconnected(wss, decoded.sub));
  ws.on("error", () => userErrored(ws));
};

module.exports = webSocket;
