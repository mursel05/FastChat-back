const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./server/config/db");
const messageRoutes = require("./server/routes/message");
const chatRoutes = require("./server/routes/chat");
const userRoutes = require("./server/routes/user");
const fileRoutes = require("./server/routes/file");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./server/config/swagger");
const path = require("path");
const webSocket = require("./server/routes/webSocket");
const wss = require("./server/config/wss");
const cors = require("cors");

// Load env vars
dotenv.config();

const app = express();
const port = process.env.PORT;

// WebSocket
wss.on("error", (err) => {
  console.log("WebSocketServer error", err);
});
wss.on("connection", (ws, req) => {
  webSocket(wss, ws, req);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use((err, req, res, next) => {
  console.error("Error: ", err);
  res.status(500).json({ success: false, message: "Server error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/api-docs`);
});
