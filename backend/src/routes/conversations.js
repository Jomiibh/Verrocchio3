import { Router } from "express";
import Conversation from "../config/models/Conversation.js";
import Message from "../config/models/Message.js";
import User from "../config/models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function mapConversation(conv, otherUser) {
  return {
    id: conv.id,
    participant_ids: conv.participantIds,
    last_message: conv.lastMessage,
    last_message_time: conv.lastMessageTime,
    other_user: otherUser
      ? {
          id: otherUser.id,
          display_name: otherUser.display_name || "",
          avatar_url: otherUser.avatar_url || null,
          username: otherUser.username,
        }
      : null,
  };
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    const convs = await Conversation.find({ participantIds: userId }).sort({ updatedAt: -1 });
    const otherIds = [...new Set(convs.map((c) => c.participantIds.find((id) => id !== userId)).filter(Boolean))];
    const users = await User.find({ _id: { $in: otherIds } });
    const userMap = new Map(users.map((u) => [u.id, u]));
    return res.json({
      conversations: convs.map((c) => mapConversation(c, userMap.get(c.participantIds.find((id) => id !== userId)))),
    });
  } catch (err) {
    console.error("GET /conversations error", err);
    return res.status(500).json({ error: "Failed to load conversations" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { participantId } = req.body || {};
    if (!participantId) return res.status(400).json({ error: "participantId required" });

    let conv = await Conversation.findOne({
      participantIds: { $all: [userId, participantId], $size: 2 },
    });

    if (!conv) {
      conv = await Conversation.create({
        participantIds: [userId, participantId],
        lastMessage: "",
        lastMessageTime: new Date(),
      });
    }

    const otherUser = await User.findById(participantId);
    return res.status(201).json({ conversation: mapConversation(conv, otherUser) });
  } catch (err) {
    console.error("POST /conversations error", err);
    return res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/:id/messages", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;
    const conv = await Conversation.findById(id);
    if (!conv || !conv.participantIds.includes(userId)) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const msgs = await Message.find({ conversationId: id }).sort({ createdAt: 1 });
    return res.json({ messages: msgs });
  } catch (err) {
    console.error("GET /conversations/:id/messages error", err);
    return res.status(500).json({ error: "Failed to load messages" });
  }
});

router.post("/:id/messages", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body || {};
    const userId = req.user?.sub;
    const conv = await Conversation.findById(id);
    if (!conv || !conv.participantIds.includes(userId)) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const recipientId = conv.participantIds.find((pid) => pid !== userId) || userId;
    const msg = await Message.create({
      conversationId: id,
      senderId: userId,
      recipientId,
      content,
    });
    conv.lastMessage = content;
    conv.lastMessageTime = msg.createdAt;
    await conv.save();
    return res.status(201).json({ message: msg });
  } catch (err) {
    console.error("POST /conversations/:id/messages error", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
