import mongoose from "mongoose";

const CVSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // bắt buộc có
    },

    title: {
      type: String,
      required: [true, "Tiêu đề CV là bắt buộc"],
      trim: true,
      maxlength: [100, "Tiêu đề không được quá 100 ký tự"],
    },
    
    isDefault: {
      type: Boolean,
      default: false,
      index: true, // cực kỳ quan trọng để tìm CV mặc định nhanh
    },
    
    // Thông tin chính
    nameCV:String,
    jobPosition: String,
    careerField: String,
    careerGoal: String,
    about: String,
    website: String,

    // Kinh nghiệm làm việc
    workExperiences: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
        description: String,
        achievements: [String],
      },
    ],

    // Học vấn
    education: [
      {
        school: { type: String, required: true },
        degree: String,
        fieldOfStudy: String,
        startDate: { type: Date, required: true },
        endDate: Date,
        description: String,
        subjects: [String],
        achievements: [String],
      },
    ],

    // Kỹ năng
    skills: [
      {
        name: { type: String, required: true, trim: true },
        category: {
          type: String,
          enum: ["hard", "soft"],
          default: "hard",
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "intermediate",
        },
      },
    ],

    certificates: [
      {
        _id: false,
        name: { type: String, required: true },
        organization: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
        credentialUrl: String,
        file: {
          filename: String,
          path: String,
          mimetype: String,
          size: Number,
        },
      },
    ],
    // File đính kèm (hình, portfolio, v.v.)
    attachments: [
      {
        filename: { type: String, required: true },
        path: { type: String, required: true },
        mimetype: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // File CV đã export (PDF, DOCX)
    exportedFiles: [
      {
        filename: { type: String, required: true },
        path: { type: String, required: true },
        mimetype: {
          type: String,
          enum: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          required: true,
        },
        size: Number,
        exportedAt: { type: Date, default: Date.now },
      },
    ],

    // Giao diện
    templateId: {
      type: String,
      default: "classic",
      enum: ["classic", "modern", "creative", "minimal"], // bạn có thể thêm sau
    },
    themeColor: {
      type: String,
      default: "#1976d2",
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, // chỉ chấp nhận hex color
    },
  },
  {
    timestamps: true,
    collection: "cvs",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEX SIÊU QUAN TRỌNG (PHẢI CÓ) ====================
CVSchema.index({ user: 1, createdAt: -1 }); // Lấy danh sách CV mới nhất
CVSchema.index({ user: 1, isDefault: 1 }); // Tìm CV mặc định siêu nhanh
CVSchema.index({ user: 1, title: "text" }); // Tìm kiếm theo tiêu đề (nếu có search)

// Đảm bảo chỉ có 1 CV mặc định duy nhất cho mỗi user
CVSchema.index(
  { user: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

// ==================== PRE MIDDLEWARE (TỰ ĐỘNG) ====================
// Khi lưu CV mới và isDefault = true → tự động bỏ mặc định các CV cũ
CVSchema.pre("save", async function (next) {
  if (this.isNew && this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, isDefault: true },
      { isDefault: false }
    );
  } else if (this.isModified("isDefault") && this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id }, isDefault: true },
      { isDefault: false }
    );
  }
  next();
});

const CV = mongoose.model("CV", CVSchema);
export default CV;
