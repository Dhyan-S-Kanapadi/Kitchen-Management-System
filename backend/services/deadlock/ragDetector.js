export function deadlockDemo() {
  const nodes = ["Order A", "Order B", "Oven", "Mixer"];
  const edges = [
    { from: "Oven", to: "Order A", type: "allocation" },
    { from: "Order A", to: "Mixer", type: "request" },
    { from: "Mixer", to: "Order B", type: "allocation" },
    { from: "Order B", to: "Oven", type: "request" }
  ];
  const cycle = ["Order A", "Mixer", "Order B", "Oven", "Order A"];
  return {
    nodes,
    edges,
    deadlockDetected: true,
    cycle,
    eventLog: [
      { time: 15, message: "Deadlock scenario started" },
      { time: 16, message: "Order A holds Oven" },
      { time: 17, message: "Order B holds Mixer" },
      { time: 18, message: "Circular wait detected: Order A -> Mixer -> Order B -> Oven -> Order A" }
    ],
    coffmanConditions: [
      { name: "Mutual Exclusion", proof: "Only one order can use one oven at a time." },
      { name: "Hold and Wait", proof: "Order A holds oven while waiting for mixer." },
      { name: "No Preemption", proof: "Resource cannot be forcibly taken during cooking." },
      { name: "Circular Wait", proof: "Order A waits for Mixer held by Order B, and Order B waits for Oven held by Order A." }
    ]
  };
}
