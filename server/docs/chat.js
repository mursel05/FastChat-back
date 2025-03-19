exports.chatsDoc = {
  "/chats": {
    post: {
      summary: "Create a new chat",
      tags: ["Chats"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isGroup: {
                  type: "boolean",
                  default: false,
                  description: "The chat type",
                },
                chatName: {
                  type: "string",
                  description: "The chat name",
                },
                chatPhoto: {
                  type: "string",
                  description: "The chat photo",
                },
                persons: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["isGroup", "chatName", "chatPhoto", "persons"],
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
                  success: {
                    type: "boolean",
                    description: "Indicates if the request was successful",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "The chat ID",
                      },
                      isGroup: {
                        type: "boolean",
                        description: "The chat type",
                      },
                      chatName: {
                        type: "string",
                        description: "The chat name",
                      },
                      createdBy: {
                        type: "string",
                        description: "The chat creator",
                      },
                      createdAt: {
                        type: "string",
                        description: "The chat creation date",
                      },
                      updatedAt: {
                        type: "string",
                        description: "The chat update date",
                      },
                      chatPhoto: {
                        type: "string",
                        description: "The chat photo",
                      },
                      persons: {
                        type: "array",
                        items: {
                          type: "string",
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
                  success: {
                    type: "boolean",
                    description: "Indicates if the request was successful",
                    default: false,
                  },
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
    get: {
      summary: "Get all chats of a user",
      tags: ["Chats"],
      responses: {
        200: {
          description: "Success message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    description: "Indicates if the request was successful",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "The chat ID",
                        },
                        isGroup: {
                          type: "boolean",
                          description: "The chat type",
                        },
                        chatName: {
                          type: "string",
                          description: "The chat name",
                        },
                        createdBy: {
                          type: "string",
                          description: "The chat creator",
                        },
                        createdAt: {
                          type: "string",
                          description: "The chat creation date",
                        },
                        updatedAt: {
                          type: "string",
                          description: "The chat update date",
                        },
                        chatPhoto: {
                          type: "string",
                          description: "The chat photo",
                        },
                        persons: {
                          type: "array",
                          items: {
                            type: "string",
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
                  success: {
                    type: "boolean",
                    description: "Indicates if the request was successful",
                    default: false,
                  },
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/chats/{chatId}": {
    delete: {
      summary: "Delete a chat",
      tags: ["Chats"],
      parameters: [
        {
          in: "path",
          name: "chatId",
          required: true,
          schema: {
            type: "string",
          },
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
                  success: {
                    type: "boolean",
                    description: "Indicates if the request was successful",
                  },
                  message: {
                    type: "string",
                    description: "Success message",
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
                  success: {
                    type: "boolean",
                    description: "Indicates if the request was successful",
                    default: false,
                  },
                  error: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
