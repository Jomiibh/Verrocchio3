import express from "express";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Public feed
router.get("/", async (_req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("author", "username displayName avatarUrl role");
  res.json(posts);
});

// Create post
router.post("/", authRequired, async (req, res) => {
  const { imageUrl, title, caption, tags } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  const post = await Post.create({
    author: req.user._id,
    imageUrl,
    title,
    caption,
    tags
  });

  res.status(201).json(post);
});

// Get single post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username displayName avatarUrl role"
  );
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// Like
router.post("/:id/like", authRequired, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
    await post.save();

    // notify author (unless liking own post)
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: "like",
        data: { postId: post._id, fromUserId: req.user._id }
      });
    }
  }

  res.json({ likesCount: post.likes.length });
});

// Unlike
router.delete("/:id/like", authRequired, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.likes = post.likes.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await post.save();
  res.json({ likesCount: post.likes.length });
});

export default router;
