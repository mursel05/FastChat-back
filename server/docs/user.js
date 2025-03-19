exports.userDoc = {
  "/users/register": {
    post: {
      summary: "Register a new user",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", description: "The user name" },
                surname: { type: "string", description: "The user surname" },
                email: { type: "string", description: "The user email" },
                password: { type: "string", description: "The user password" },
              },
              required: ["name", "surname", "email", "password"],
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
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
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
  "/users/login": {
    post: {
      summary: "Login a user",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", description: "The user email" },
                password: { type: "string", description: "The user password" },
              },
              required: ["email", "password"],
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
                  data: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
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
  "/users/refresh-tokens": {
    post: {
      summary: "Refresh access and refresh tokens",
      tags: ["Users"],
      responses: {
        200: {
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
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
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
        401: {
          description: "Unauthorized message",
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
  "/users/forgot-password": {
    post: {
      summary: "Send an email to reset password",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", description: "The user email" },
              },
              required: ["email"],
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
  "/users/reset-password": {
    post: {
      summary: "Update password",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: { type: "string", description: "The user token" },
                password: { type: "string", description: "The user password" },
              },
              required: ["password", "token"],
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
  "/users/{id}": {
    put: {
      summary: "Update a user by ID",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
          description: "The ID of the user to update",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", description: "The user name" },
                surname: { type: "string", description: "The user surname" },
                photo: { type: "string", description: "The user photo" },
              },
              required: ["name", "surname", "photo"],
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
  "/users/{email}": {
    get: {
      summary: "Get user by email",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "email",
          required: true,
          schema: { type: "string" },
          description: "The email of the user to get",
        },
      ],
      responses: {
        200: {
          description: "User found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The user ID" },
                        name: { type: "string", description: "The user name" },
                        surname: {
                          type: "string",
                          description: "The user surname",
                        },
                        email: {
                          type: "string",
                          description: "The user email",
                        },
                        photo: {
                          type: "string",
                          description: "The user photo",
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
  "/users/id/{id}": {
    get: {
      summary: "Get user by id",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
          description: "The id of the user to get",
        },
      ],
      responses: {
        200: {
          description: "User found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The user ID" },
                        name: { type: "string", description: "The user name" },
                        surname: {
                          type: "string",
                          description: "The user surname",
                        },
                        email: {
                          type: "string",
                          description: "The user email",
                        },
                        photo: {
                          type: "string",
                          description: "The user photo",
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
  "/users/{email}": {
    get: {
      summary: "Get user by email",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "email",
          required: true,
          schema: { type: "string" },
          description: "The email of the user to get",
        },
      ],
      responses: {
        200: {
          description: "User found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The user ID" },
                        name: { type: "string", description: "The user name" },
                        surname: {
                          type: "string",
                          description: "The user surname",
                        },
                        email: {
                          type: "string",
                          description: "The user email",
                        },
                        photo: {
                          type: "string",
                          description: "The user photo",
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

  "/users": {
    get: {
      summary: "Get user",
      tags: ["Users"],
      responses: {
        200: {
          description: "User found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The user ID" },
                        name: { type: "string", description: "The user name" },
                        surname: {
                          type: "string",
                          description: "The user surname",
                        },
                        email: {
                          type: "string",
                          description: "The user email",
                        },
                        photo: {
                          type: "string",
                          description: "The user photo",
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
};
