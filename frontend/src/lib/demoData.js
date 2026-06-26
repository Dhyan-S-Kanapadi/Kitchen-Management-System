export const conceptCards = [
  ["CPU Scheduling", "Chef chooses which food order runs next using FCFS, SJF, Priority, or Round Robin."],
  ["Producer-Consumer", "Customers and waiters produce orders; chefs consume them from a bounded buffer."],
  ["Semaphore", "Limited stove, oven, fryer, counter, and mixer counts are protected by wait/signal."],
  ["Mutex", "Inventory updates enter one critical section at a time."],
  ["Deadlock", "Order A and Order B hold resources while waiting for each other."]
];

export const concepts = [
  "Process", "CPU", "CPU Scheduling", "FCFS", "SJF", "Priority Scheduling", "Round Robin", "Ready Queue", "Waiting Queue", "Context Switching", "Burst Time", "Arrival Time", "Waiting Time", "Turnaround Time", "Response Time", "Throughput", "Producer-Consumer Problem", "Semaphore", "Mutex", "Critical Section", "Deadlock", "Coffman Conditions"
];

export const conceptText = (name) => ({
  definition: `${name} is demonstrated as an operating-system control rule inside the kitchen simulation.`,
  analogy: `In KitchenFlow OS, ${name} maps to orders, chefs, queues, tools, recipe pages, and kitchen resources.`,
  implementation: `The backend service returns step snapshots, metrics, event logs, and explanation text for ${name}.`,
  example: `Professor prompt: "Show ${name}". The related page highlights the queue, state change, metric, or resource action.`
});
