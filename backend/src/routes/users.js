import { Router } from "express";
import User from "../config/models/User.js";
import { requireAuth } from "../middleware/auth.js";

function toClientUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    display_name: user.display_name || "",
    avatar_url: user.avatar_url || null,
    banner_url: user.banner_url || null,
    bio: user.bio || "",
    social_links: user.socialLinks || {},
    role: user.role === "artist" ? 1 : 2, // align with frontend enum (Artist=1, Buyer=2)
  };
}

const router = Router();

// Get current user's profile
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user?.sub);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user: toClientUser(user) });
  } catch (err) {
    console.error("GET /users/me error", err);
    return res.status(500).json({ error: "Failed to load profile" });
  }
});

// Update current user's profile
router.put("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    const update = {};

    const {
      display_name,
      bio,
      avatar_url,
      banner_url,
      social_links,
    } = req.body || {};

    if (typeof display_name === "string") update.display_name = display_name;
    if (typeof bio === "string") update.bio = bio;
    if (typeof avatar_url === "string") update.avatar_url = avatar_url;
    if (typeof banner_url === "string") update.banner_url = banner_url;
    if (social_links && typeof social_links === "object") {
      update.socialLinks = {
        twitter: social_links.twitter || "",
        instagram: social_links.instagram || "",
        discord: social_links.discord || "",
        other: social_links.other || "",
      };
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: toClientUser(user) });
  } catch (err) {
    console.error("PUT /users/me error", err);
    return res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;

// List artists with optional search (by display_name, username, artStyles)
router.get("/artists", async (req, res) => {
  try {
    const { q } = req.query;
    const query = { role: "artist" };

    if (q && typeof q === "string") {
      const regex = new RegExp(q, "i");
      query.$or = [
        { display_name: regex },
        { username: regex },
        { artStyles: regex },
      ];
    }

    const artists = await User.find(query).limit(200);

    const result = artists.map((user) => ({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name || "",
        avatar_url: user.avatar_url || null,
        bio: user.bio || "",
      },
      artist: {
        id: user.id,
        user_id: user.id,
        bio: user.bio || "",
        art_style_tags: user.artStyles || [],
        portfolio_image_urls: (user.slides || []).map((s) => s.imageUrl).filter(Boolean),
        price_range_min: user.priceMin || 0,
        price_range_max: user.priceMax || 0,
      },
    }));

    return res.json({ artists: result });
  } catch (err) {
    console.error("GET /users/artists error", err);
    return res.status(500).json({ error: "Failed to load artists" });
  }
});
