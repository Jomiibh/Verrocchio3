import express from "express";
import Notification from "../models/Notification.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// List notifications
router.get("/", authRequired, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
});

// Mark read
router.post("/:id/read", authRequired, async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) return res.status(404).json({ error: "Not found" });
  if (notif.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not allowed" });
  }
  notif.read = true;
  await notif.save();
  res.json({ ok: true });
});

export default router;
