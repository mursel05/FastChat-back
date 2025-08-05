const fastify = require("fastify")({
  logger: false
});
const dotenv = require("dotenv");
const connectDB = require("./server/config/db");
const path = require("path");

dotenv.config();

// Register plugins
async function buildFastify() {
  try {
    // Register CORS
    await fastify.register(require("@fastify/cors"), {
      origin: process.env.CLIENT_URL,
      credentials: true,
    });

    // Register multipart for file uploads
    await fastify.register(require("@fastify/multipart"));

    // Register static files
    await fastify.register(require("@fastify/static"), {
      root: path.join(__dirname, "public"),
      prefix: "/public/",
    });

    // Register WebSocket
    await fastify.register(require("@fastify/websocket"));

    // Register Swagger
    const { chatsDoc } = require("./server/docs/chat");
    const { messagesDoc } = require("./server/docs/message");
    const { userDoc } = require("./server/docs/user");
    const { fileDoc } = require("./server/docs/file");

    await fastify.register(require("@fastify/swagger"), {
      openapi: {
        openapi: "3.0.0",
        info: {
          title: "FastChat API",
          version: "1.0.0",
          description: "API Documentation for FastChat",
        },
        servers: [
          {
            url: "http://localhost:5000/api",
            description: "Local server",
          },
          {
            url: "https://melodies-back.onrender.com",
            description: "Development server",
          },
        ],
        paths: {
          ...chatsDoc,
          ...messagesDoc,
          ...userDoc,
          ...fileDoc,
        },
      },
    });

    await fastify.register(require("@fastify/swagger-ui"), {
      routePrefix: "/api-docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
    });

    // Connect to MongoDB
    connectDB();

    // Register routes
    await fastify.register(require("./server/routes/user"), { prefix: "/api/users" });
    await fastify.register(require("./server/routes/message"), { prefix: "/api/messages" });
    await fastify.register(require("./server/routes/chat"), { prefix: "/api/chats" });
    await fastify.register(require("./server/routes/file"), { prefix: "/api/files" });

    // Register WebSocket routes
    await fastify.register(require("./server/routes/webSocket"), { prefix: "/ws" });

    // Error handling
    fastify.setErrorHandler((error, request, reply) => {
      console.log("Error: ", error);
      reply.status(500).send({ success: false, message: "Server error" });
    });

    return fastify;
  } catch (err) {
    console.error("Error building Fastify app:", err);
    process.exit(1);
  }
}

// Start server
const start = async () => {
  try {
    const app = await buildFastify();
    const port = process.env.PORT || 5000;
    
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Server running on ${port}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

start();
