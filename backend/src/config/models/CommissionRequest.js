import mongoose from "mongoose";

const CommissionRequestSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budgetMin: Number,
    budgetMax: Number,
    images: [String],
    tags: [String],
    timeframe: String, // e.g. "1-2 weeks"

    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open"
    },

    assignedArtist: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("CommissionRequest", CommissionRequestSchema);
