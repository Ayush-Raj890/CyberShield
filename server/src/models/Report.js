import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["PHISHING", "SCAM", "HARASSMENT", "OTHER"],
      default: "OTHER"
    },
    evidence: {
      type: String
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW"
    },
    contactEmail: {
      type: String
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    isSensitive: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "RESOLVED"],
      default: "PENDING"
    },
    history: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
