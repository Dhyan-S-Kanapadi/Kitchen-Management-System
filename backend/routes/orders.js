import { Router } from "express";
import { demoOrders, makeOrder } from "../services/simulation/simulationEngine.js";

const router = Router();
let orders = demoOrders();

router.get("/", (_req, res) => res.json(orders));

router.post("/", (req, res) => {
  const body = req.body;
  const order = makeOrder(
    body.id || `O-${Date.now()}`,
    body.customerName || "Guest",
    body.foodItem || "Pizza",
    body.orderType || "Dine-in",
    body.arrivalTime ?? orders.length,
    body.cookingTime ?? 8,
    body.priority ?? 3,
    body.requiredResources || ["Stove"],
    body.requiredIngredients || ["Oil"]
  );
  orders.push(order);
  res.status(201).json(order);
});

router.put("/:id", (req, res) => {
  const index = orders.findIndex((order) => order.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Order not found" });
  orders[index] = { ...orders[index], ...req.body };
  res.json(orders[index]);
});

router.delete("/:id", (req, res) => {
  orders = orders.filter((order) => order.id !== req.params.id);
  res.json({ deleted: req.params.id });
});

export function getOrders() {
  return orders;
}

export function resetOrders(nextOrders = demoOrders()) {
  orders = nextOrders;
  return orders;
}

export default router;
