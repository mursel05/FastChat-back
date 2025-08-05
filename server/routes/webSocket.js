const wssData = require("../config/wssData");
const { verifyAccessToken } = require("../controllers/tokenController");
const {
  userConnected,
  userDisconnected,
  userErrored,
} = require("../controllers/wsController");
const cookie = require("cookie");

async function routes(fastify, options) {
  fastify.register(async function (fastify) {
    fastify.get("/", { websocket: true }, (connection, request) => {
      const { socket } = connection;
      
      // Extract token from query params or headers
      const cookies = cookie.parse(request.headers.cookie || "");
      const accessToken = cookies.accessToken;
      const decoded = verifyAccessToken(accessToken);
      
      if (!decoded) {
        socket.close(1008, "Unauthorized");
        return;
      }

      // Handle connection
      userConnected(null, socket, decoded.sub);

      socket.on("message", (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          if (parsedMessage.type.includes("call")) {
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
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      });

      socket.on("close", () => userDisconnected(null, decoded.sub));
      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        userErrored(socket);
      });
    });
  });
}

module.exports = routes;
