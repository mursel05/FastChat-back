const cookie = require("cookie");
const { verifyAccessToken } = require("../controllers/tokenController");

// Fastify preHandler for authentication
exports.authenticate = async (request, reply) => {
  try {
    const cookies = request.headers.cookie ? cookie.parse(request.headers.cookie) : {};
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }
    request.userId = decoded.sub;
  } catch (error) {
    return reply.status(401).send({ success: false, message: "Unauthorized" });
  }
};
