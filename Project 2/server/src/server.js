import http from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { connectDatabase } from "./db.js";
import { configureSockets } from "./socket.js";

async function start() {
  await connectDatabase();
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: config.clientUrl, credentials: true },
  });
  app.set("io", io);
  configureSockets(io);
  server.listen(config.port, () => {
    console.log(`API and Socket.IO listening on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exitCode = 1;
});
