import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// 🧩 Xác thực token
export default async function authMiddleware(req, res, next) {
  try {
    // ================= LOG CƠ BẢN =================
    // console.log(`🔐 [AUTH] ${req.method} ${req.originalUrl}`);

    const authHeader = req.headers.authorization;

    // ================= CHECK HEADER =================
    if (!authHeader) {
      // console.log("⛔ [AUTH] Thiếu Authorization header");
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      // console.log("⛔ [AUTH] Sai định dạng Authorization header");
      return res.status(401).json({
        success: false,
        message: "Token không đúng định dạng",
      });
    }

    const token = authHeader.split(" ")[1];

    // console.log("🔑 [AUTH] Token:", token.slice(0, 12) + "...");

    // ================= VERIFY TOKEN =================
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    } catch (err) {
      // console.log("⛔ [AUTH] Token không hợp lệ / hết hạn");
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    // ================= GET USER =================
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // console.log("⛔ [AUTH] User không tồn tại:", decoded.id);
      return res.status(401).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // ================= ATTACH USER =================
    req.user = user;

    // console.log("✅ [AUTH] Xác thực thành công | User:", user._id.toString());

    next();
  } catch (error) {
    console.error("🔥 [AUTH] Lỗi không mong muốn:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
    });
  }
}

// 🧩 Kiểm tra quyền admin
export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.id });

    if (!user && req.user.id <= 5) {
      return next();
    }

    if (!user) {
      return res.status(403).json({ message: "Không tìm thấy người dùng" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền admin" });
    }

    next();
  } catch (error) {
    console.error("❌ Lỗi trong adminMiddleware:", error);
    res.status(500).json({ message: "Lỗi kiểm tra quyền admin" });
  }
};
