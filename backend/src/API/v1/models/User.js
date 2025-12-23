// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true, sparse: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  name: { type: String, trim: true, default: null },
  avatar: {
    type: String,
    default:
      "https://ui-avatars.com/api/?name=User&background=random&bold=true",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "other",
    lowercase: true,
    trim: true,
  },
  birthDay: Date,
  address: String,
  bio: String,
  jobTitle: String,
  skills: [String],
  experience: String,
  education: String,

  isProfileComplete: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  tokenVersion: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
  cvs: [
    {
      cv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CV",
        required: true,
      },
      title: {
        type: String, // 👉 TÊN CV HIỂN THỊ
        required: true,
        trim: true,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  defaultCV: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CV",
  },
  

  resetPasswordToken: String,
  resetPasswordExpires: Date,
  otpCode: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

// Cập nhật updatedAt
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// CHỐNG HASH MẬT KHẨU 2 LẦN – SIÊU AN TOÀN
userSchema.pre("save", async function (next) {
  try {
    // Chỉ hash khi:
    // 1. password bị thay đổi
    // 2. và password hiện tại KHÔNG phải là hash bcrypt (chưa bị hash hoặc là chuỗi thô)
    if (
      this.isModified("password") &&
      this.password &&
      !this.password.startsWith("$2b$") && // bcrypt hash luôn bắt đầu bằng $2b$
      !this.password.startsWith("$2a$")
    ) {
      console.log("Đang hash mật khẩu mới (chỉ 1 lần duy nhất)...");
      this.password = await bcrypt.hash(this.password, 10);
    }

    // Tạo userId đẹp
    if (!this.userId) {
      const lastUser = await this.constructor
        .findOne({ userId: { $exists: true } })
        .sort({ userId: -1 })
        .select("userId")
        .lean();

      this.userId = lastUser && lastUser.userId ? lastUser.userId + 1 : 100000;
    }

    // Tạo tên tạm
    if (!this.name && this.userId) {
      this.name = `User${this.userId}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementTokenVersion = function () {
  this.tokenVersion += 1;
  return this.save();
};

export default mongoose.model("User", userSchema);
