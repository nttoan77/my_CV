// src/API/v1/Controller/CvController.js
import CV from "../models/CV.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { uploadCVFiles } from "../../../middlewares/upload.js";
import { deleteFile } from "../../../util/fileHelper.js"; // nếu bạn có xóa file khi xóa CV

class CvController {
  // Tạo CV mới
  // static async createCV(req, res) {
  //   // console.log("CREATE CV ĐƯỢC GỌI");
  //   // console.log("User ID từ token:", req.user._id);
  //   // console.log("Full req.body:", req.body);
  //   // console.log("req.files:", req.files);

  //   try {
  //     const userId = req.user._id;

  //     // ==================== VALIDATE ====================
  //     if (!req.body.title?.trim()) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Tiêu đề CV là bắt buộc",
  //       });
  //     }

  //     // ==================== BUILD DATA ====================
  //     const cvData = {
  //       user: userId,
  //       title: req.body.title.trim(),
  //       jobPosition: req.body.jobPosition?.trim() || "",
  //       nameCV: req.body.nameCV?.trim() || "",
  //       careerField: req.body.careerField?.trim() || "",
  //       careerGoal: req.body.careerGoal?.trim() || "",
  //       about: req.body.about?.trim() || "",
  //       website: req.body.website?.trim() || "",
  //       workExperiences: [],
  //       education: [],
  //       skills: [],
  //       certificates: [],
  //       attachments: [],
  //       exportedFiles: [],
  //     };

  //     // ==================== PARSE JSON ====================
  //     try {
  //       if (req.body.workExperiences) {
  //         cvData.workExperiences = JSON.parse(req.body.workExperiences);
  //       }
  //       if (req.body.education) {
  //         cvData.education = JSON.parse(req.body.education);
  //       }
  //       if (req.body.skills) {
  //         cvData.skills = JSON.parse(req.body.skills);
  //       }
  //       if (req.body.certificates) {
  //         cvData.certificates = JSON.parse(req.body.certificates);
  //       }
  //     } catch (err) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Dữ liệu JSON không hợp lệ",
  //       });
  //     }

  //     // =====================================================
  //     // 🔥🔥🔥 LOGIC QUAN TRỌNG NHẤT: MAP FILE → CERTIFICATES
  //     // =====================================================
  //     if (req.files?.certificateFiles?.length) {
  //       req.files.certificateFiles.forEach((file, index) => {
  //         if (cvData.certificates[index]) {
  //           cvData.certificates[index].file = {
  //             filename: file.filename, // 🔧 FIX
  //             path: file.path.replace(/\\/g, "/"), // 🔧 FIX
  //             mimetype: file.mimetype,
  //             size: file.size,
  //           };
  //         }
  //       });
  //     }

  //     // =====================================================
  //     // ❌ KHÔNG DÙNG attachments cho certificates nữa
  //     // (Nếu sau này có file khác thì xử lý riêng)
  //     // =====================================================

  //     // ==================== SET DEFAULT CV ====================
  //     const cvCount = await CV.countDocuments({ user: userId });
  //     if (cvCount === 0) {
  //       cvData.isDefault = true;
  //     }

  //     // ==================== SAVE CV ====================
  //     const newCV = new CV(cvData);
  //     await newCV.save();
  //     console.log("✅ CV mới được tạo với ID:", newCV._id.toString());

  //     // ==================== UPDATE USER ====================
  //     await User.findByIdAndUpdate(
  //       userId,
  //       {
  //         $push: {
  //           cvs: {
  //             cv: newCV._id,
  //             title: newCV.title,
  //             isDefault: newCV.isDefault,
  //             updatedAt: newCV.updatedAt,
  //           },
  //         },
  //         ...(newCV.isDefault && { defaultCV: newCV._id }),
  //       },
  //       { new: true }
  //     );

  //     // ==================== RESPONSE ====================
  //     return res.status(201).json({
  //       success: true,
  //       message: "Tạo CV thành công!",
  //       data: newCV,
  //     });
  //   } catch (error) {
  //     // console.error("LỖI createCV:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Lỗi tạo CV",
  //       error: error.message,
  //     });
  //   }
  // }

  static async createCV(req, res) {
    try {
      const userId = req.user._id;

      // ==================== VALIDATE ====================
      if (!req.body.title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Tiêu đề CV là bắt buộc",
        });
      }

      // ==================== BUILD DATA ====================
      const cvData = {
        user: userId,
        title: req.body.title.trim(),
        jobPosition: req.body.jobPosition?.trim() || "",
        nameCV: req.body.nameCV?.trim() || "",
        careerField: req.body.careerField?.trim() || "",
        careerGoal: req.body.careerGoal?.trim() || "",
        about: req.body.about?.trim() || "",
        website: req.body.website?.trim() || "",
        workExperiences: [],
        education: [],
        skills: [],
        certificates: [],
        attachments: [],
        exportedFiles: [],
      };

      // ==================== PARSE JSON ====================
      try {
        if (req.body.workExperiences) {
          cvData.workExperiences = JSON.parse(req.body.workExperiences);
        }
        if (req.body.education) {
          cvData.education = JSON.parse(req.body.education);
        }
        if (req.body.skills) {
          cvData.skills = JSON.parse(req.body.skills);
        }
        if (req.body.certificates) {
          cvData.certificates = JSON.parse(req.body.certificates);
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu JSON không hợp lệ",
        });
      }

      // =====================================================
      // 🔥🔥🔥 LOGIC QUAN TRỌNG NHẤT: MAP FILE → CERTIFICATES
      // =====================================================
      if (req.files?.certificateFiles?.length) {
        req.files.certificateFiles.forEach((file, index) => {
          if (cvData.certificates[index]) {
            cvData.certificates[index].file = {
              filename: file.filename,
              path: file.path.replace(/\\/g, "/"),
              mimetype: file.mimetype,
              size: file.size,
            };
          }
        });
      }

      // ==================== SET DEFAULT CV ====================
      const cvCount = await CV.countDocuments({ user: userId });
      if (cvCount === 0) {
        cvData.isDefault = true;
      }

      // ==================== SAVE CV ====================
      const newCV = new CV(cvData);
      await newCV.save();

      console.log("✅ CV mới được tạo với ID:", newCV._id.toString()); // ← SỬA TẠI ĐÂY: Thêm log để dễ debug ID

      // ==================== UPDATE USER ====================
      // ← SỬA TẠI ĐÂY: Tách riêng để rõ ràng và tránh lỗi spread operator
      const updateUserQuery = {
        $push: {
          cvs: {
            cvId: newCV._id, // Đảm bảo push đúng _id của CV mới
            title: newCV.title,
            isDefault: newCV.isDefault,
            updatedAt: newCV.updatedAt || new Date(),
          },
        },
      };

      // Chỉ set defaultCV nếu CV này là mặc định
      if (newCV.isDefault) {
        updateUserQuery.$set = { defaultCV: newCV._id }; // ← SỬA TẠI ĐÂY: Set defaultCV rõ ràng
      }

      await User.findByIdAndUpdate(userId, updateUserQuery, { new: true });

      // console.log("✅ Đã cập nhật User.cvs và defaultCV (nếu có) thành công"); // ← SỬA TẠI ĐÂY: Log xác nhận đồng bộ

      // ==================== RESPONSE ====================
      return res.status(201).json({
        success: true,
        message: "Tạo CV thành công!",
        data: newCV,
      });
    } catch (error) {
      // console.error("LỖI createCV:", error); // ← Thêm log lỗi chi tiết hơn
      return res.status(500).json({
        success: false,
        message: "Lỗi tạo CV",
        error: error.message,
      });
    }
  }

  // Lấy CV mặc định
  static async getDefaultCV(req, res) {
    try {
      const cv = await CV.findOne({
        user: req.user._id,
        isDefault: true,
      }).lean();
      if (!cv) {
        return res
          .status(404)
          .json({ success: false, message: "Chưa có CV mặc định" });
      }
      return res.json({ success: true, data: cv });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  // Lấy danh sách CV của mình
  static async getMyCVs(req, res) {
    try {
      const cvs = await CV.find({ user: req.user._id })
        .sort({ isDefault: -1, updatedAt: -1 })
        .select("-__v") // ẩn field không cần thiết
        .lean(); // tăng tốc (nếu không cần method của document)

      return res.json({
        success: true,
        count: cvs.length,
        data: cvs,
      });
    } catch (error) {
      console.error("GetMyCVs Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  // Lấy CV theo ID
  static async getCVById(req, res) {
    try {
      // console.log("🔍 Đang tìm CV với ID:", req.params.id);
      // console.log("👤 User ID từ token:", req.user._id);

      const cv = await CV.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).lean();

      if (!cv) {
        // console.log("❌ Không tìm thấy CV hoặc không có quyền");
        return res.status(404).json({
          success: false,
          message: "CV không tồn tại hoặc bạn không có quyền truy cập",
        });
      }

      // console.log("✅ Tìm thấy CV:", cv.title); // hoặc cv._id
      return res.json({ success: true, data: cv });
    } catch (error) {
      console.error("🔥 Lỗi getCVById:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }
  // Cập nhật CV
  static async updateCV(req, res) {
    try {
      const updates = { ...req.body };

      // Chỉ cho phép cập nhật những field này
      const allowedFields = [
        "title",
        "jobPosition",
        "careerField",
        "careerGoal",
        "about",
        "website",
        "workExperiences",
        "education",
        "skills",
        "certificates",
        "templateId",
        "themeColor",
        "isDefault",
      ];

      Object.keys(updates).forEach((key) => {
        if (!allowedFields.includes(key)) delete updates[key];
      });

      // Xử lý file mới (thay thế toàn bộ hoặc append tùy bạn)
      if (req.files?.attachments && Array.isArray(req.files.attachments)) {
        updates.attachments = req.files.attachments.map((file) => ({
          filename: file.originalname,
          path: file.path.replace(/\\/g, "/"),
          mimetype: file.mimetype,
          size: file.size,
        }));
      }

      const cv = await CV.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        updates,
        { new: true, runValidators: true }
      );

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: "CV không tồn tại hoặc bạn không có quyền",
        });
      }

      return res.json({
        success: true,
        message: "Cập nhật CV thành công",
        data: cv,
      });
    } catch (error) {
      console.error("Update CV Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi cập nhật CV" });
    }
  }

  // Xóa CV
  static async deleteCV(req, res) {
    try {
      const cv = await CV.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!cv) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy CV" });
      }

      // Nếu xóa CV mặc định → chọn CV mới nhất làm mặc định
      if (cv.isDefault) {
        const nextCV = await CV.findOne({ user: req.user._id }).sort({
          updatedAt: -1,
        });
        if (nextCV) {
          nextCV.isDefault = true;
          await nextCV.save();
        }
      }

      // Optional: Xóa file trên server nếu cần
      // cv.attachments.forEach(file => deleteFile(file.path));

      return res.json({ success: true, message: "Xóa CV thành công" });
    } catch (error) {
      console.error("Delete CV Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi xóa CV" });
    }
  }

  // Đặt CV làm mặc định
  static async setDefaultCV(req, res) {
    try {
      const cvId = req.params.id;

      // Tắt tất cả CV mặc định cũ
      await CV.updateMany({ user: req.user._id }, { isDefault: false });

      // Bật CV mới
      const cv = await CV.findOneAndUpdate(
        { _id: cvId, user: req.user._id },
        { isDefault: true },
        { new: true }
      );

      if (!cv) {
        return res
          .status(404)
          .json({ success: false, message: "CV không tồn tại" });
      }

      return res.json({
        success: true,
        message: "Đã đặt làm CV mặc định",
        data: cv,
      });
    } catch (error) {
      console.error("Set Default CV Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }
}

export default CvController;
