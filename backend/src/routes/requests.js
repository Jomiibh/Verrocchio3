import { Router } from "express";
import CommissionRequest from "../config/models/CommissionRequest.js";
import User from "../config/models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function mapRequest(doc, user) {
  return {
    id: doc.id,
    poster_id: doc.posterId,
    title: doc.title,
    description: doc.description,
    budget_min: doc.budgetMin,
    budget_max: doc.budgetMax,
    timeframe: doc.timeframe,
    status: doc.status,
    tags: doc.tags || [],
    sample_image_urls: doc.sampleImageUrls || [],
    created_at: doc.createdAt,
    user: user
      ? {
          id: user.id,
          display_name: user.display_name || "",
          avatar_url: user.avatar_url || null,
          username: user.username,
        }
      : null,
  };
}

router.get("/", async (_req, res) => {
  try {
    const requests = await CommissionRequest.find().sort({ createdAt: -1 });
    const userIds = [...new Set(requests.map((r) => r.posterId))];
    const users = await User.find({ _id: { $in: userIds } });
    const userMap = new Map(users.map((u) => [u.id, u]));
    return res.json({
      requests: requests.map((r) => mapRequest(r, userMap.get(r.posterId))),
    });
  } catch (err) {
    console.error("GET /requests error", err);
    return res.status(500).json({ error: "Failed to load requests" });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const requests = await CommissionRequest.find({ posterId: req.user?.sub }).sort({ createdAt: -1 });
    const user = await User.findById(req.user?.sub);
    return res.json({
      requests: requests.map((r) => mapRequest(r, user)),
    });
  } catch (err) {
    console.error("GET /requests/mine error", err);
    return res.status(500).json({ error: "Failed to load requests" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, budget_min, budget_max, timeframe, tags, sample_image_urls } = req.body || {};
    const doc = await CommissionRequest.create({
      posterId: req.user?.sub,
      title,
      description,
      budgetMin: budget_min || 0,
      budgetMax: budget_max || 0,
      timeframe: timeframe || "",
      status: "open",
      tags: tags || [],
      sampleImageUrls: sample_image_urls || [],
    });
    const user = await User.findById(req.user?.sub);
    return res.status(201).json({ request: mapRequest(doc, user) });
  } catch (err) {
    console.error("POST /requests error", err);
    return res.status(500).json({ error: "Failed to create request" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, budget_min, budget_max, timeframe, tags, sample_image_urls, status } = req.body || {};
    const update = {
      title,
      description,
      budgetMin: budget_min,
      budgetMax: budget_max,
      timeframe,
      tags,
      sampleImageUrls: sample_image_urls,
    };
    if (status) update.status = status;

    const doc = await CommissionRequest.findOneAndUpdate(
      { _id: id, posterId: req.user?.sub },
      update,
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Request not found" });
    const user = await User.findById(req.user?.sub);
    return res.json({ request: mapRequest(doc, user) });
  } catch (err) {
    console.error("PUT /requests/:id error", err);
    return res.status(500).json({ error: "Failed to update request" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await CommissionRequest.deleteOne({ _id: id, posterId: req.user?.sub });
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /requests/:id error", err);
    return res.status(500).json({ error: "Failed to delete request" });
  }
});

export default router;
