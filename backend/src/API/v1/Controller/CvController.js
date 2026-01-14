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

  // static async createCV(req, res) {
  //   try {
  //     const userId = req.user._id;

  //     // ==================== LOG TOÀN BỘ REQ ====================
  //     console.log("🚀 [CREATE CV] User ID:", userId);
  //     console.log("📥 [CREATE CV] req.body keys:", Object.keys(req.body));
  //     console.log(
  //       "📄 [CREATE CV] req.body.certificates (raw):",
  //       req.body.certificates
  //     );
  //     console.log(
  //       "🗂️ [CREATE CV] req.files:",
  //       req.files
  //         ? Object.keys(req.files).map(
  //             (key) => `${key}: ${req.files[key]?.length || 0} files`
  //           )
  //         : "No files"
  //     );

  //     // Nếu có certificateFiles
  //     if (req.files?.certificateFiles?.length) {
  //       console.log(
  //         "📸 [CREATE CV] certificateFiles count:",
  //         req.files.certificateFiles.length
  //       );
  //       req.files.certificateFiles.forEach((file, idx) => {
  //         console.log(`   File ${idx}:`, {
  //           originalname: file.originalname,
  //           filename: file.filename,
  //           path: file.path,
  //           mimetype: file.mimetype,
  //           size: file.size,
  //         });
  //       });
  //     }

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
  //     let certificates = [];

  //     if (req.body.certificates) {
  //       try {
  //         certificates = JSON.parse(req.body.certificates);
  //         console.log("✅ [CREATE CV] Parsed certificates JSON:", certificates);
  //         console.log("   Certificates count from JSON:", certificates.length);
  //       } catch (err) {
  //         console.error(
  //           "❌ [CREATE CV] JSON.parse certificates failed:",
  //           err.message
  //         );
  //         return res.status(400).json({
  //           success: false,
  //           message: "Dữ liệu JSON certificates không hợp lệ",
  //         });
  //       }
  //     } else {
  //       console.log("⚠️ [CREATE CV] No certificates JSON in req.body");
  //     }

  //     // ==================== GẮN FILE VÀO CERTIFICATES ====================
  //     if (req.files?.certificateFiles?.length) {
  //       console.log("🔗 [CREATE CV] Starting to map files to certificates...");

  //       req.files.certificateFiles.forEach((file, index) => {
  //         // Đảm bảo có phần tử tại index
  //         if (!certificates[index]) {
  //           console.log(`   Tạo mới certificate[${index}] vì chưa tồn tại`);
  //           certificates[index] = { name: "Chứng chỉ" };
  //         }

  //         certificates[index].file = {
  //           filename: file.filename,
  //           path: file.path.replace(/\\/g, "/"),
  //           mimetype: file.mimetype,
  //           size: file.size,
  //         };

  //         console.log(
  //           `   Đã gắn file vào certificate[${index}]:`,
  //           certificates[index].file.filename
  //         );
  //       });
  //     } else {
  //       console.log("⚠️ [CREATE CV] Không có certificateFiles nào được upload");
  //     }

  //     // Log cuối cùng trước khi lưu
  //     console.log("💾 [CREATE CV] Final certificates trước khi lưu DB:");
  //     certificates.forEach((cert, idx) => {
  //       console.log(`   Certificate ${idx}:`, {
  //         name: cert.name,
  //         hasFile: !!cert.file,
  //         fileInfo: cert.file
  //           ? {
  //               filename: cert.file.filename,
  //               path: cert.file.path,
  //               mimetype: cert.file.mimetype,
  //               size: cert.file.size,
  //             }
  //           : "No file",
  //       });
  //     });

  //     cvData.certificates = certificates;

  //     // ... phần lưu DB tiếp theo (create new CV)

  //     // Sau khi lưu thành công, log thêm nếu cần
  //     const newCV = await CV.create(cvData);
  //     console.log("🎉 CV created with ID:", newCV._id);

  //     // res.status(201).json({ ... });
  //   } catch (error) {
  //     console.error("💥 [CREATE CV] Lỗi server:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Lỗi server",
  //     });
  //   }
  // }
  /* =====================================================
     🔧 NORMALIZE CERTIFICATES
  ===================================================== */
  static normalizeCertificates(raw = []) {
    // console.log("🧪 [CERT] normalize input:", raw);

    if (!Array.isArray(raw)) return [];

    return raw.map((c, index) => {
      const normalized = {
        name: c.name?.trim() || `Chứng chỉ ${index + 1}`,
        organization: c.organization?.trim() || "",
        issueDate: c.issueDate ? new Date(c.issueDate) : null,
        expiryDate: c.expiryDate ? new Date(c.expiryDate) : null,
        credentialId: c.credentialId?.trim() || "",
        credentialUrl: c.credentialUrl?.trim() || "",
        file: null,
      };

      // console.log(`ℹ️ [CERT] normalized[${index}]`, normalized);
      return normalized;
    });
  }

  /* =====================================================
     📌 CREATE CV
  ===================================================== */
  static async createCV(req, res) {
    try {
      /* ================= AUTH ================= */
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
  
      /* ================= VALIDATE ================= */
      if (!req.body.title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Tiêu đề CV là bắt buộc",
        });
      }
  
      /* ================= PARSE CERTIFICATES ================= */
      let certificates = [];
  
      if (req.body.certificates) {
        try {
          certificates = CvController.normalizeCertificates(
            JSON.parse(req.body.certificates)
          );
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Certificates JSON không hợp lệ",
          });
        }
      }
  
      /* ================= MAP CERTIFICATE FILES ================= */
      if (req.files?.certificateFiles?.length) {
        req.files.certificateFiles.forEach((file, index) => {
          if (!certificates[index]) return;
  
          certificates[index].file = {
            filename: file.filename,
            path: file.path.replace(/\\/g, "/"),
            mimetype: file.mimetype,
            size: file.size,
          };
        });
      }
  
      /* =====================================================
         🔧 FIX 1: PARSE CÁC MẢNG JSON KHÁC (TRƯỚC ĐÂY BỊ THIẾU)
         ===================================================== */
      let workExperiences = [];
      let education = [];
      let skills = [];
  
      try {
        if (req.body.workExperiences) {
          workExperiences = JSON.parse(req.body.workExperiences);
        }
  
        if (req.body.education) {
          education = JSON.parse(req.body.education);
        }
  
        if (req.body.skills) {
          skills = JSON.parse(req.body.skills);
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu work/education/skills không hợp lệ",
        });
      }
  
      /* =====================================================
         🔧 FIX 2: PARSE isDefault AN TOÀN HƠN (KHÔNG PHÁ CŨ)
         ===================================================== */
      const isDefault =
        req.body.isDefault === true ||
        req.body.isDefault === "true" ||
        req.body.isDefault === "1";
  
      /* ================= CREATE PAYLOAD ================= */
      const cvPayload = {
        user: req.user._id,
        title: req.body.title.trim(),
        isDefault, // 🔧 FIX (thay thế dòng cũ)
  
        nameCV: req.body.nameCV || "",
        jobPosition: req.body.jobPosition || "",
        careerField: req.body.careerField || "",
        careerGoal: req.body.careerGoal || "",
        about: req.body.about || "",
        website: req.body.website || "",
  
        // 🔧 FIX 3: GÁN CÁC FIELD TRƯỚC ĐÂY CHƯA LƯU
        workExperiences,
        education,
        skills,
  
        certificates,
      };
  
      const cv = await CV.create(cvPayload);
  
      return res.status(201).json({
        success: true,
        message: "Tạo CV thành công",
        data: cv,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
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
      // console.error("GetMyCVs Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  // Lấy CV theo ID
  static async getCVById(req, res) {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "CV ID không hợp lệ",
        });
      }
  
      const cv = await CV.findOne({
        _id: id,
        user: req.user._id,
      }).lean();
  
      if (!cv) {
        return res.status(404).json({
          success: false,
          message: "CV không tồn tại hoặc bạn không có quyền truy cập",
        });
      }
  
      return res.json({ success: true, data: cv });
    } catch (error) {
      // console.error("🔥 Lỗi getCVById:", error);
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

  // Xóa cv mềm 
  static async getTrashCVs(req, res) {
    const userId = req.user.id;
  
    const cvs = await CV.find({
      userId,
      isDeleted: true,
    }).sort({ deletedAt: -1 });
  
    res.json(cvs);
  };

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
