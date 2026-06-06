import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspaces.js";
import boardRoutes from "./routes/boards.js";
import { errorHandler, notFound } from "./middleware.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/workspaces", workspaceRoutes);
  app.use("/api/boards", boardRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
