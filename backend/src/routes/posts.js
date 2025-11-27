import { Router } from "express";
import Post from "../config/models/Post.js";
import User from "../config/models/User.js";
import { requireAuth } from "../middleware/auth.js";

function mapPost(doc, author) {
  return {
    id: doc.id,
    authorId: doc.authorId,
    body: doc.body,
    imageUrls: doc.imageUrls || [],
    likes: doc.likes || 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    author: author
      ? {
          id: author.id,
          display_name: author.display_name || "",
          avatar_url: author.avatar_url || null,
          username: author.username,
        }
      : null,
  };
}

const router = Router();

// List posts (newest first)
router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(200);
    const authorIds = [...new Set(posts.map((p) => p.authorId))];
    const authors = await User.find({ _id: { $in: authorIds } });
    const authorMap = new Map(authors.map((u) => [u.id, u]));
    return res.json({
      posts: posts.map((p) => mapPost(p, authorMap.get(p.authorId))),
    });
  } catch (err) {
    console.error("GET /posts error", err);
    return res.status(500).json({ error: "Failed to load posts" });
  }
});

// Create post
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { body = "", imageUrls = [] } = req.body || {};

    const post = await Post.create({
      authorId: userId,
      body,
      imageUrls,
      likes: 0,
    });

    const author = await User.findById(userId);
    return res.status(201).json({ post: mapPost(post, author) });
  } catch (err) {
    console.error("POST /posts error", err);
    return res.status(500).json({ error: "Failed to create post" });
  }
});

export default router;
