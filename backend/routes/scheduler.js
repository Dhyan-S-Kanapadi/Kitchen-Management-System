import { Router } from "express";
import { getOrders } from "./orders.js";
import { runFcfs } from "../services/scheduler/fcfs.js";
import { runSjf } from "../services/scheduler/sjf.js";
import { runPriority } from "../services/scheduler/priority.js";
import { runRoundRobin } from "../services/scheduler/roundRobin.js";

const router = Router();

function run(algorithm, orders, chefs, quantum) {
  if (algorithm === "SJF") return runSjf(orders, chefs);
  if (algorithm === "Priority") return runPriority(orders, chefs);
  if (algorithm === "Round Robin") return runRoundRobin(orders, chefs, quantum);
  return runFcfs(orders, chefs);
}

router.post("/run", (req, res) => {
  const { algorithm = "FCFS", chefs = 1, quantum = 4, orders = getOrders() } = req.body;
  res.json(run(algorithm, orders, Number(chefs), Number(quantum)));
});

router.post("/compare", (req, res) => {
  const { chefs = 1, quantum = 4, orders = getOrders() } = req.body;
  res.json({
    results: ["FCFS", "SJF", "Priority", "Round Robin"].map((algorithm) => run(algorithm, orders, Number(chefs), Number(quantum)))
  });
});

export default router;
