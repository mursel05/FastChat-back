const wssData = require("../config/wssData");
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
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    if (
      ["callOffer", "callAnswer", "callCandidate", "callEnd"].includes(
        parsedMessage.type
      )
    ) {
      wssData.users.forEach(
        (user) =>
          parsedMessage.data.userId === user.id &&
          user.ws.send(
            JSON.stringify({
              ...parsedMessage,
              data: { ...parsedMessage.data, userId: decoded.sub },
            })
          )
      );
    }
  });
  ws.on("close", () => userDisconnected(wss, decoded.sub));
  ws.on("error", () => userErrored(ws));
};

module.exports = webSocket;
