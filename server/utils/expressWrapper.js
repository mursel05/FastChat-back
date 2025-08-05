// Compatibility wrapper to use Express-style controllers with Fastify
function wrapExpressHandler(handler) {
  return async (request, reply) => {
    // Create Express-like req and res objects
    const req = {
      ...request,
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
      files: request.files,
      file: request.file,
      userId: request.userId,
      fileType: request.fileType,
      filePath: request.filePath,
      protocol: request.protocol || (request.headers['x-forwarded-proto'] || 'http'),
      get: (headerName) => request.headers[headerName.toLowerCase()],
    };

    const res = {
      status: (code) => {
        reply.code(code);
        return res;
      },
      json: (data) => {
        return reply.send(data);
      },
      send: (data) => {
        return reply.send(data);
      },
      cookie: (name, value, options = {}) => {
        return reply.setCookie(name, value, options);
      },
      clearCookie: (name, options = {}) => {
        return reply.clearCookie(name, options);
      },
      sendFile: (filePath) => {
        return reply.sendFile(filePath);
      },
    };

    try {
      await handler(req, res);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = { wrapExpressHandler };