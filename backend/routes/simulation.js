import { Router } from "express";
import { demoOrders, simulationStep } from "../services/simulation/simulationEngine.js";
import { resetOrders } from "./orders.js";

const router = Router();
let step = 0;

router.post("/demo-data", (_req, res) => res.json({ orders: resetOrders(demoOrders()) }));
router.post("/start", (_req, res) => {
  step = 0;
  res.json(simulationStep(step));
});
router.post("/step", (_req, res) => res.json(simulationStep(++step)));
router.post("/previous", (_req, res) => {
  step = Math.max(0, step - 1);
  res.json(simulationStep(step));
});
router.post("/reset", (_req, res) => {
  step = 0;
  res.json(simulationStep(step));
});

export default router;
