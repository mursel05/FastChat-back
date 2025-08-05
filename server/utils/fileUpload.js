const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");

const pump = promisify(pipeline);

function getFileExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() : "";
}

// Fastify multipart file handler for public uploads
async function handlePublicUpload(request, reply) {
  try {
    const data = await request.file();
    
    if (!data) {
      return reply.status(404).send({ success: false, message: "No file uploaded" });
    }

    // Create user directory
    const userDir = path.join("public", request.userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Generate filename
    const fileName = `${uuidv4()}.${getFileExtension(data.filename)}`;
    const filePath = path.join(userDir, fileName);

    // Save file
    await pump(data.file, fs.createWriteStream(filePath));

    // Set file metadata on request for controller
    request.file = {
      originalname: data.filename,
      filename: fileName,
      path: filePath,
    };
    request.fileType = data.mimetype;
    request.filePath = `${request.protocol}://${request.headers.host}/public/${request.userId}/${fileName}`;

    return { success: true };
  } catch (error) {
    throw error;
  }
}

// Fastify multipart file handler for private uploads
async function handlePrivateUpload(request, reply) {
  try {
    const data = await request.file();
    
    if (!data) {
      return reply.status(404).send({ success: false, message: "No file uploaded" });
    }

    // Create chat directory
    const chatDir = path.join("uploads", request.params.chatId);
    if (!fs.existsSync(chatDir)) {
      fs.mkdirSync(chatDir, { recursive: true });
    }

    // Generate filename
    const fileName = `${uuidv4()}.${getFileExtension(data.filename)}`;
    const filePath = path.join(chatDir, fileName);

    // Save file
    await pump(data.file, fs.createWriteStream(filePath));

    // Set file metadata on request for controller
    request.file = {
      originalname: data.filename,
      filename: fileName,
      path: filePath,
    };
    request.fileType = data.mimetype;
    request.filePath = path.join(request.params.chatId, fileName);

    return { success: true };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  handlePublicUpload,
  handlePrivateUpload,
};