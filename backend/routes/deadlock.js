import { Router } from "express";
import { deadlockDemo } from "../services/deadlock/ragDetector.js";
import { resolveDeadlock } from "../services/deadlock/deadlockResolver.js";

const router = Router();

router.post("/demo", (_req, res) => res.json(deadlockDemo()));
router.post("/detect", (_req, res) => res.json(deadlockDemo()));
router.post("/resolve", (req, res) => res.json(resolveDeadlock(req.body.strategy)));

export default router;
