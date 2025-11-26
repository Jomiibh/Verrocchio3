import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ notifications: [] });
});

export default router;
