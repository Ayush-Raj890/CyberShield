import mongoose from "mongoose";

const trustScanReportSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrustScanJob",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    url: {
      type: String,
      required: true
    },
    normalizedDomain: {
      type: String,
      required: true,
      index: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    verdict: {
      type: String,
      enum: ["LOW_RISK", "MEDIUM_RISK", "HIGH_RISK"],
      required: true
    },
    factors: {
      type: [
        {
          key: { type: String, required: true },
          label: { type: String, required: true },
          impact: { type: Number, required: true },
          status: { type: String, required: true },
          detail: { type: String, required: true }
        }
      ],
      default: []
    },
    summary: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("TrustScanReport", trustScanReportSchema);
