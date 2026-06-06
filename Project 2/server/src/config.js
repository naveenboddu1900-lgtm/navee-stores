import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/collabspace",
  jwtSecret: process.env.JWT_SECRET || "development-secret-change-me",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
