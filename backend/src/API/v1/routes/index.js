import express from "express";
import userRoutes from "./routes.js"; // route cho user
import adminRoutes from "./adminRouter.js"; // route cho admin
import CVRouter from "./CVRouter.js"; // router cho cv

const router = express.Router();

// Gom nhóm tất cả routes
router.use("/Admin", adminRoutes); // /api/auth/Admin/...
router.use("/auth", userRoutes); // /api/auth/...
router.use("/cv", CVRouter);// /api/cv/..

export default router;
