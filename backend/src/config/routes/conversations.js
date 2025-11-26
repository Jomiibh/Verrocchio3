import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// List conversations
router.get("/", authRequired, async (req, res) => {
  const convos = await Conversation.find({
    participants: req.user._id
  })
    .sort({ updatedAt: -1 })
    .populate("participants", "username displayName avatarUrl");
  res.json(convos);
});

// Get messages in a conversation
router.get("/:id/messages", authRequired, async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ error: "Not found" });
  if (!convo.participants.includes(req.user._id)) {
    return res.status(403).json({ error: "Not allowed" });
  }

  const messages = await Message.find({ conversation: convo._id })
    .sort({ createdAt: 1 })
    .populate("sender", "username displayName avatarUrl");

  res.json(messages);
});

// Start or get existing conversation with another user
router.post("/", authRequired, async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  let convo = await Conversation.findOne({
    participants: { $all: [req.user._id, userId] }
  });
  if (!convo) {
    convo = await Conversation.create({
      participants: [req.user._id, userId],
      lastMessageAt: new Date()
    });
  }
  convo = await convo.populate("participants", "username displayName avatarUrl");
  res.status(201).json(convo);
});

// Send message
router.post("/:id/messages", authRequired, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text required" });

  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ error: "Not found" });
  if (!convo.participants.includes(req.user._id)) {
    return res.status(403).json({ error: "Not allowed" });
  }

  const message = await Message.create({
    conversation: convo._id,
    sender: req.user._id,
    text,
    readBy: [req.user._id]
  });

  convo.lastMessageAt = new Date();
  await convo.save();

  // Notify the other participant(s)
  for (const userId of convo.participants) {
    if (userId.toString() === req.user._id.toString()) continue;
    await Notification.create({
      user: userId,
      type: "new_message",
      data: {
        conversationId: convo._id,
        fromUserId: req.user._id
      }
    });
  }

  const populated = await message.populate(
    "sender",
    "username displayName avatarUrl"
  );
  res.status(201).json(populated);
});

export default router;
