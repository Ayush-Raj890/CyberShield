import mongoose from "mongoose";

const analyticsMetricSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("AnalyticsMetric", analyticsMetricSchema);
