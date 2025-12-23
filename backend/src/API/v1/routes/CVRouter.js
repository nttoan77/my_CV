import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

import CvController from "../Controller/CvController.js";
import protect from "../../v1/middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   1️⃣ CẤU HÌNH UPLOAD FILE (TÁCH RÕ – DỄ BẢO TRÌ)
===================================================== */

// ✅ [SỬA] chuẩn hoá đường dẫn upload
const uploadDir = path.join(process.cwd(), "public/uploads/cv");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ [SỬA] cấu hình storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `cv_${req.user._id}_${Date.now()}_${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    cb(null, uniqueName);
  },
});

// ✅ [SỬA] filter file rõ ràng
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("❌ File không hợp lệ"), false);
  }

  cb(null, true);
};

// ✅ [SỬA] upload middleware dùng chung
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// ✅ [SỬA] tách middleware upload cho CV
const uploadCVFiles = upload.fields([
  { name: "certificateFiles", maxCount: 10 },
  { name: "attachments", maxCount: 5 },
]);

/* =====================================================
   2️⃣ ROUTES – TUÂN THỦ REST API (KHÔNG TRÙNG PATH)
===================================================== */

/**
 * 📌 TẠO CV
 * POST /api/cv
 */
router.post(
  "/",
  protect, // ✅ BẮT BUỘC trước upload
  uploadCVFiles, // ✅ upload nhiều loại file
  CvController.createCV
);

/**
 * 📌 LẤY DANH SÁCH CV CỦA USER
 * GET /api/cv
 */
router.get("/", protect, CvController.getMyCVs);

/**
 * 📌 LẤY CV MẶC ĐỊNH
 * GET /api/cv/default
 */
router.get("/default", protect, CvController.getDefaultCV);

/**
 * 📌 LẤY CHI TIẾT 1 CV
 * GET /api/cv/:id
 */
router.get("/:id", protect, CvController.getCVById);

/**
 * 📌 CẬP NHẬT CV
 * PUT /api/cv/:id
 */
router.put(
  "/:id",
  protect,
  uploadCVFiles, // ✅ dùng lại middleware
  CvController.updateCV
);

/**
 * 📌 XOÁ CV
 * DELETE /api/cv/:id
 */
router.delete("/:id", protect, CvController.deleteCV);

/**
 * 📌 SET CV MẶC ĐỊNH
 * PATCH /api/cv/:id/default
 */
router.patch("/:id/default", protect, CvController.setDefaultCV);

export default router;
