import express from "express";
import CommissionRequest from "../models/CommissionRequest.js";
import Notification from "../models/Notification.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Buyer: create request
router.post("/", authRequired, async (req, res) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ error: "Only buyers can create requests" });
  }

  const { title, description, budgetMin, budgetMax, images, tags, timeframe } =
    req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing title or description" });
  }

  const request = await CommissionRequest.create({
    buyer: req.user._id,
    title,
    description,
    budgetMin,
    budgetMax,
    images,
    tags,
    timeframe
  });

  // Could notify artists later if you want
  res.status(201).json(request);
});

// Buyer: my requests
router.get("/mine", authRequired, async (req, res) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ error: "Only buyers have My Requests" });
  }

  const requests = await CommissionRequest.find({ buyer: req.user._id }).sort({
    createdAt: -1
  });
  res.json(requests);
});

// Artists: board (only open)
router.get("/board", authRequired, async (req, res) => {
  if (req.user.role !== "artist") {
    return res.status(403).json({ error: "Only artists see the board" });
  }

  const { tag } = req.query;
  const filter = { status: "open" };
  if (tag) filter.tags = tag;

  const requests = await CommissionRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("buyer", "username displayName avatarUrl");
  res.json(requests);
});

// Buyer: update / delete own request
router.patch("/:id", authRequired, async (req, res) => {
  const request = await CommissionRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (request.buyer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not your request" });
  }

  const allowed = [
    "title",
    "description",
    "budgetMin",
    "budgetMax",
    "images",
    "tags",
    "timeframe",
    "status"
  ];
  for (const key of allowed) {
    if (key in req.body) request[key] = req.body[key];
  }
  await request.save();

  if (request.assignedArtist) {
    await Notification.create({
      user: request.assignedArtist,
      type: "request_update",
      data: { requestId: request._id }
    });
  }

  res.json(request);
});

router.delete("/:id", authRequired, async (req, res) => {
  const request = await CommissionRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (request.buyer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not your request" });
  }
  await request.deleteOne();
  res.json({ ok: true });
});

// Artist: express interest (this is where you auto-DM + notify)
router.post("/:id/interest", authRequired, async (req, res) => {
  if (req.user.role !== "artist") {
    return res.status(403).json({ error: "Only artists" });
  }
  const request = await CommissionRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ error: "Not found" });

  // For now just notify buyer
  await Notification.create({
    user: request.buyer,
    type: "new_request",
    data: {
      requestId: request._id,
      fromArtistId: req.user._id
    }
  });

  res.json({ ok: true });
});

export default router;
