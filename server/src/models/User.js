import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER"
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationOTP: {
      type: String
    },
    otpExpires: {
      type: Date,
      index: { expires: 600 }
    },
    failedOtpAttempts: {
      type: Number,
      default: 0
    },
    alias: {
      type: String,
      unique: true,
      sparse: true
    },
    bio: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
