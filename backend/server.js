import express from "express";
import cors from "cors";
import ordersRouter from "./routes/orders.js";
import schedulerRouter from "./routes/scheduler.js";
import resourcesRouter from "./routes/resources.js";
import synchronizationRouter from "./routes/synchronization.js";
import deadlockRouter from "./routes/deadlock.js";
import simulationRouter from "./routes/simulation.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", project: "KitchenFlow OS", offline: true });
});

app.use("/api/orders", ordersRouter);
app.use("/api/scheduler", schedulerRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/sync", synchronizationRouter);
app.use("/api/deadlock", deadlockRouter);
app.use("/api/simulation", simulationRouter);

app.listen(port, () => {
  console.log(`KitchenFlow OS backend running on http://localhost:${port}`);
});
