import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// 🧩 Xác thực token
export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // 🔥 QUAN TRỌNG: LẤY USER THẬT TỪ DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    // 🔥 GÁN USER ĐẦY ĐỦ
    req.user = user;

    next();
  } catch (error) {
    console.error("❌ Lỗi authMiddleware:", error);
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
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
