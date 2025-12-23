// src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const cvUploadDir = path.join(process.cwd(), "public", "uploads", "cv");

// ✅ OK: tạo folder nếu chưa có
if (!fs.existsSync(cvUploadDir)) {
  fs.mkdirSync(cvUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    // ✅ FIX: phân biệt file chứng chỉ
    const prefix =
      file.fieldname === "certificateFiles"
        ? "certificate"
        : "cv";

    const filename = `${prefix}_${req.user._id}_${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
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
    cb(new Error("Chỉ chấp nhận ảnh, PDF, Word, Excel"));
  }
};

// ❗❗❗ FIX QUAN TRỌNG NHẤT Ở ĐÂY
export const uploadCVFiles = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter,
}).fields([
  // ✅ FIX: FILE CHỨNG CHỈ
  { name: "certificateFiles", maxCount: 20 },

  // (nếu sau này có avatar, cover CV thì thêm tiếp)
  // { name: "avatar", maxCount: 1 },
]);
