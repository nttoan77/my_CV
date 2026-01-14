// src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// ==================== GIỮ NGUYÊN ====================
const cvUploadDir = path.join(process.cwd(), "public", "uploads", "cv");

// Tạo folder nếu chưa có
if (!fs.existsSync(cvUploadDir)) {
  fs.mkdirSync(cvUploadDir, { recursive: true });
}

// ==================== STORAGE ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvUploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    // ==================== 🔧 SỬA 1: prefix RÕ RÀNG ====================
    const prefix =
      file.fieldname === "certificateFiles"
        ? "certificate"
        : file.fieldname === "attachments"
        ? "attachment"
        : "cv";

    const filename = `${prefix}_${req.user._id}_${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// ==================== FILE FILTER ====================
const fileFilter = (req, file, cb) => {
  // 🔧 SỬA 2: log debug (test xong có thể xoá)
  console.log("📦 UPLOAD FILE:", file.fieldname, file.originalname);

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Chỉ chấp nhận ảnh, PDF, Word, Excel"), false);
  }
};

// ==================== 🔥 FIX QUAN TRỌNG NHẤT ====================
export const uploadCVFiles = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter,
}).fields([
  // 🔧 SỬA 3: GIỮ certificateFiles
  { name: "certificateFiles", maxCount: 20 },

  // 🔧 SỬA 4: THÊM attachments (TRƯỚC BẠN THIẾU)
  { name: "attachments", maxCount: 10 },
]);
