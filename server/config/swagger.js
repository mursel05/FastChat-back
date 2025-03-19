const swaggerJSDoc = require("swagger-jsdoc");
const { chatsDoc } = require("../docs/chat");
const { messagesDoc } = require("../docs/message");
const { userDoc } = require("../docs/user");
const { fileDoc } = require("../docs/file");

// Swagger Configuration
const swaggerOptions = {
  definition: {
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
  apis: ["./server/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
