import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./API/v1/routes/index.js";
import db from "./config/db/index.js";
import fixUserIdIndex from "../src/config/fixUserIdIndex.js";
import { logRoutes } from "./debugRoutes.js";

const app = express();
const port = 8888;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================== ĐOẠN DUY NHẤT BẠN CẦN SỬA ====================
// import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CHỈ GIỮ LẠI 1 DÒNG NÀY THÔI – ẢNH SẼ HIỆN NGAY!
app.use(express.static(path.join(process.cwd(), "public")));
// =================================================================

app.use(methodOverride("_method"));
app.use(cors());

// Routes
app.use("/api", apiRoutes);

// Khởi động server
const startServer = async () => {
  try {
    await db.connect();
    await fixUserIdIndex();

    app.listen(port, () => {
      console.log(`Server chạy tại http://localhost:${port}`);
      // logRoutes(app);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
    process.exit(1);
  }
};

startServer();
