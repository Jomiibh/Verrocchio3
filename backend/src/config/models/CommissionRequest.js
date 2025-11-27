import mongoose from "mongoose";

const CommissionRequestSchema = new mongoose.Schema(
  {
    posterId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    budgetMin: { type: Number, default: 0 },
    budgetMax: { type: Number, default: 0 },
    timeframe: { type: String, default: "" },
    status: { type: String, default: "open" },
    tags: [String],
    sampleImageUrls: [String],
  },
  { timestamps: true }
);

export default mongoose.model("CommissionRequest", CommissionRequestSchema);
