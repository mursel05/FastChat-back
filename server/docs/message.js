exports.messagesDoc = {
  "/messages": {
    post: {
      summary: "Send a message to a chat",
      tags: ["Messages"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                chatId: { type: "string", description: "The chat ID" },
                message: { type: "string", description: "The message" },
                mediaUrl: { type: "string", description: "The media URL" },
                fileName: { type: "string", description: "The file name" },
                messageType: {
                  type: "string",
                  description: "The message type",
                },
              },
              required: ["chatId", "message", "mediaUrl", "messageType"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Success message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      chatId: { type: "string" },
                      message: { type: "string" },
                      mediaUrl: { type: "string" },
                      fileName: { type: "string" },
                      messageType: { type: "string" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                      sender: { type: "string" },
                      deleteMessage: {
                        type: "array",
                        items: { type: "string" },
                      },
                      seen: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            userId: { type: "string" },
                            seenAt: { type: "string" },
                          },
                        },
                      },
                      reactions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            userId: { type: "string" },
                            reactionType: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Error message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", default: false },
                  error: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/messages/{chatId}": {
    get: {
      summary: "Get all messages from a chat",
      tags: ["Messages"],
      parameters: [
        {
          in: "path",
          name: "chatId",
          required: true,
          schema: { type: "string" },
          description: "The chat ID",
        },
      ],
      responses: {
        200: {
          description: "Success message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: { type: "array", items: { type: "object" } },
                },
              },
            },
          },
        },
        400: {
          description: "Error message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", default: false },
                  error: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/messages/{messageId}": {
    delete: {
      summary: "Delete a message",
      tags: ["Messages"],
      parameters: [
        {
          in: "path",
          name: "messageId",
          required: true,
          schema: { type: "string" },
          description: "The message ID",
        },
      ],
      responses: {
        200: {
          description: "Success message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        400: {
          description: "Error message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", default: false },
                  error: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/messages/seen-message": {
    post: {
      summary: "Mark a message as seen",
      tags: ["Messages"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                messageId: { type: "string", description: "The message ID" },
              },
              required: ["messageId"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Success message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        400: {
          description: "Error message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", default: false },
                  error: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
