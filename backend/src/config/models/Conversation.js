import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participantIds: { type: [String], required: true },
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
