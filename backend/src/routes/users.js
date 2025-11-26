import { Router } from "express";

const router = Router();

// Placeholder user routes
router.get("/", (_req, res) => {
  res.json({ users: [] });
});

export default router;
