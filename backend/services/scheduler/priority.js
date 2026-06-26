import { packageSchedule } from "./metrics.js";

export function runPriority(orders, chefCount = 1) {
  const remaining = [...orders];
  const chefAvailable = Array.from({ length: chefCount }, () => 0);
  const ganttChart = [];
  const explanationSteps = [];
  const eventLog = [];
  while (remaining.length) {
    const chefIndex = chefAvailable.indexOf(Math.min(...chefAvailable));
    const time = Math.min(...chefAvailable);
    const available = remaining.filter((order) => order.arrivalTime <= time);
    const candidates = available.length ? available : remaining.sort((a, b) => a.arrivalTime - b.arrivalTime);
    const order = candidates.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime)[0];
    remaining.splice(remaining.findIndex((item) => item.id === order.id), 1);
    const start = Math.max(order.arrivalTime, chefAvailable[chefIndex]);
    const end = start + order.cookingTime;
    chefAvailable[chefIndex] = end;
    ganttChart.push({ orderId: order.id, orderName: order.foodItem, chef: `Chef ${chefIndex + 1}`, start, end, algorithm: "Priority Scheduling" });
    explanationSteps.push({ selectedAlgorithm: "Priority Scheduling", selectedOrder: order.foodItem, reason: `Reason: ${order.foodItem} has the highest priority value in the ready queue. Lower number means higher priority.`, currentReadyQueue: candidates.map((item) => `${item.foodItem} (P${item.priority})`), currentTime: start, chefAssigned: `Chef ${chefIndex + 1}` });
    eventLog.push({ time: start, message: `Scheduler selected ${order.foodItem} using Priority Scheduling` });
  }
  return packageSchedule("Priority Scheduling", orders, ganttChart, chefCount, Math.max(0, ganttChart.length - chefCount), explanationSteps, eventLog);
}
