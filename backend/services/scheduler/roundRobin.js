import { packageSchedule } from "./metrics.js";

export function runRoundRobin(orders, chefCount = 1, quantum = 4) {
  const sorted = [...orders].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const remaining = new Map(sorted.map((order) => [order.id, order.cookingTime]));
  const queue = [];
  const ganttChart = [];
  const explanationSteps = [];
  const eventLog = [];
  let time = Math.min(...sorted.map((order) => order.arrivalTime));
  let index = 0;
  while (index < sorted.length || queue.length) {
    while (index < sorted.length && sorted[index].arrivalTime <= time) queue.push(sorted[index++]);
    if (!queue.length) {
      time = sorted[index].arrivalTime;
      continue;
    }
    const order = queue.shift();
    const slice = Math.min(quantum, remaining.get(order.id));
    const start = time;
    const end = time + slice;
    remaining.set(order.id, remaining.get(order.id) - slice);
    ganttChart.push({ orderId: order.id, orderName: order.foodItem, chef: `Chef ${((ganttChart.length % chefCount) + 1)}`, start, end, algorithm: "Round Robin" });
    explanationSteps.push({ selectedAlgorithm: "Round Robin", selectedOrder: order.foodItem, reason: `Reason: ${order.foodItem} is next in the circular queue and receives ${slice} minutes quantum.`, currentReadyQueue: queue.map((item) => item.foodItem), currentTime: start, chefAssigned: `Chef ${((ganttChart.length - 1) % chefCount) + 1}` });
    eventLog.push({ time: start, message: `${order.foodItem} received CPU time slice of ${slice}` });
    time = end;
    while (index < sorted.length && sorted[index].arrivalTime <= time) queue.push(sorted[index++]);
    if (remaining.get(order.id) > 0) queue.push(order);
  }
  return packageSchedule("Round Robin", orders, ganttChart, chefCount, Math.max(0, ganttChart.length - 1), explanationSteps, eventLog);
}
