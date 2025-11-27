import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },
    body: { type: String, default: "" },
    imageUrls: [String],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
