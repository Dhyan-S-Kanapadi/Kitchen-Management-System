import { packageSchedule } from "./metrics.js";

export function runFcfs(orders, chefCount = 1) {
  const sorted = [...orders].sort((a, b) => a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id));
  const chefAvailable = Array.from({ length: chefCount }, () => 0);
  const ganttChart = [];
  const explanationSteps = [];
  const eventLog = [];
  for (const order of sorted) {
    const chefIndex = chefAvailable.indexOf(Math.min(...chefAvailable));
    const start = Math.max(order.arrivalTime, chefAvailable[chefIndex]);
    const end = start + order.cookingTime;
    chefAvailable[chefIndex] = end;
    ganttChart.push(block(order, chefIndex + 1, start, end, "FCFS"));
    explanationSteps.push(step("FCFS", order, start, `Reason: ${order.foodItem} arrived first among available orders at time ${order.arrivalTime}.`, chefIndex + 1, sorted));
    eventLog.push({ time: order.arrivalTime, message: `${order.foodItem} order arrived` }, { time: start, message: `Scheduler selected ${order.foodItem} using FCFS for Chef ${chefIndex + 1}` });
  }
  return packageSchedule("FCFS", orders, ganttChart, chefCount, Math.max(0, ganttChart.length - chefCount), explanationSteps, eventLog);
}

function block(order, chef, start, end, algorithm) {
  return { orderId: order.id, orderName: order.foodItem, chef: `Chef ${chef}`, start, end, algorithm };
}

function step(algorithm, order, currentTime, reason, chef, queue) {
  return { selectedAlgorithm: algorithm, selectedOrder: order.foodItem, reason, currentReadyQueue: queue.filter((item) => item.arrivalTime <= currentTime).map((item) => item.foodItem), currentTime, chefAssigned: `Chef ${chef}` };
}
