import express from "express";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Public search for artists
router.get("/artists", async (req, res) => {
  const { q, style } = req.query;

  const filter = { role: "artist" };
  if (q) {
    filter.$or = [
      { username: new RegExp(q, "i") },
      { displayName: new RegExp(q, "i") },
      { bio: new RegExp(q, "i") }
    ];
  }
  if (style) {
    filter.artStyles = style;
  }

  const artists = await User.find(filter)
    .select(
      "username displayName bio avatarUrl bannerUrl artStyles priceMin priceMax slides socialLinks"
    )
    .limit(50);

  res.json(artists);
});

// Public artist profile by id
router.get("/artists/:id", async (req, res) => {
  const artist = await User.findById(req.params.id).select(
    "username displayName bio avatarUrl bannerUrl artStyles priceMin priceMax socialLinks slides createdAt"
  );
  if (!artist) return res.status(404).json({ error: "Artist not found" });
  res.json(artist);
});

// Update own profile
router.patch("/me/profile", authRequired, async (req, res) => {
  const allowed = [
    "displayName",
    "bio",
    "avatarUrl",
    "bannerUrl",
    "artStyles",
    "priceMin",
    "priceMax",
    "socialLinks"
  ];
  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }

  Object.assign(req.user, updates);
  await req.user.save();
  res.json(req.user);
});

// Add slide
router.post("/me/slides", authRequired, async (req, res) => {
  const { imageUrl, title, description, tags } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }
  req.user.slides.push({ imageUrl, title, description, tags });
  await req.user.save();
  res.status(201).json(req.user.slides[req.user.slides.length - 1]);
});

// Delete slide
router.delete("/me/slides/:slideId", authRequired, async (req, res) => {
  req.user.slides.id(req.params.slideId)?.remove();
  await req.user.save();
  res.json({ ok: true });
});

export default router;
