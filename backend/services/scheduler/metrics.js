export function buildMetrics(completedOrders, totalTime, chefCount, busyTime, contextSwitches) {
  const count = completedOrders.length || 1;
  const totals = completedOrders.reduce(
    (acc, order) => {
      acc.waiting += order.waitingTime;
      acc.turnaround += order.turnaroundTime;
      acc.response += order.responseTime;
      return acc;
    },
    { waiting: 0, turnaround: 0, response: 0 }
  );
  return {
    averageWaitingTime: round(totals.waiting / count),
    averageTurnaroundTime: round(totals.turnaround / count),
    averageResponseTime: round(totals.response / count),
    throughput: round(completedOrders.length / Math.max(totalTime, 1)),
    chefUtilization: round((busyTime / Math.max(totalTime * chefCount, 1)) * 100),
    contextSwitches
  };
}

export function packageSchedule(algorithm, sourceOrders, ganttChart, chefCount, contextSwitches, explanationSteps, eventLog) {
  const byId = new Map(sourceOrders.map((order) => [order.id, { ...order }]));
  for (const block of ganttChart) {
    const order = byId.get(block.orderId);
    if (!order) continue;
    order.firstStartTime = Math.min(order.firstStartTime ?? block.start, block.start);
    order.completionTime = Math.max(order.completionTime ?? 0, block.end);
  }
  const completedOrders = [...byId.values()]
    .filter((order) => order.completionTime !== undefined)
    .map((order) => ({
      ...order,
      state: "COMPLETED",
      turnaroundTime: order.completionTime - order.arrivalTime,
      waitingTime: order.completionTime - order.arrivalTime - order.cookingTime,
      responseTime: order.firstStartTime - order.arrivalTime
    }));
  const totalTime = Math.max(...ganttChart.map((block) => block.end), 0);
  const busyTime = ganttChart.reduce((sum, block) => sum + (block.end - block.start), 0);
  return {
    algorithm,
    scheduledTimeline: ganttChart,
    ganttChart,
    completedOrders,
    readyQueueSnapshots: explanationSteps.map((step) => ({ time: step.currentTime, queue: step.currentReadyQueue })),
    runningSnapshots: ganttChart.map((block) => ({ time: block.start, chef: block.chef, order: block.orderName })),
    waitingQueueSnapshots: [],
    metrics: buildMetrics(completedOrders, totalTime, chefCount, busyTime, contextSwitches),
    eventLog,
    explanationSteps,
    contextSwitches
  };
}

export function round(value) {
  return Math.round(value * 100) / 100;
}
