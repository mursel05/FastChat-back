exports.fileDoc = {
  "/files": {
    post: {
      summary: "Upload a file",
      tags: ["Files"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                  description: "The file to upload",
                },
              },
              required: ["file"],
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
                      fileName: { type: "string" },
                      filePath: { type: "string" },
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
                  success: { type: "boolean" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
