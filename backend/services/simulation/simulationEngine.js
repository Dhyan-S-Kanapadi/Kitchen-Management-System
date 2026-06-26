export const recipePages = {
  Pizza: [1, 3, 5, 7],
  Pasta: [2, 4, 6],
  Burger: [1, 4, 8],
  Sandwich: [2, 5],
  "French Fries": [6, 9],
  "VIP Special Order": [3, 7, 10],
  Cake: [5, 7, 11]
};

export function demoOrders() {
  return [
    makeOrder("O-101", "Aarav", "Pasta", "Dine-in", 0, 12, 3, ["Stove"], ["Pasta", "Sauce", "Oil"]),
    makeOrder("O-102", "Diya", "Pizza", "Delivery", 1, 16, 2, ["Oven", "Counter"], ["Cheese", "Dough", "Sauce"]),
    makeOrder("O-103", "Kabir", "Sandwich", "Takeaway", 2, 5, 5, ["Counter"], ["Bread", "Cheese", "Sauce"]),
    makeOrder("O-104", "Meera", "Burger", "Dine-in", 3, 10, 4, ["Stove", "Counter"], ["Bread", "Cheese", "Oil"]),
    makeOrder("O-105", "Neil", "French Fries", "Takeaway", 4, 7, 4, ["Fryer"], ["Oil"]),
    makeOrder("O-106", "VIP Guest", "VIP Special Order", "VIP", 5, 9, 1, ["Stove", "Mixer"], ["Cheese", "Sauce", "Oil"]),
    makeOrder("O-107", "Isha", "Cake", "Dine-in", 6, 14, 3, ["Oven", "Mixer"], ["Dough", "Cheese"])
  ];
}

export function makeOrder(id, customerName, foodItem, orderType, arrivalTime, cookingTime, priority, requiredResources, requiredIngredients) {
  return {
    id,
    customerName,
    foodItem,
    orderType,
    arrivalTime: Number(arrivalTime),
    cookingTime: Number(cookingTime),
    priority: Number(priority),
    requiredResources,
    requiredIngredients,
    recipePages: recipePages[foodItem] || [1, 2],
    state: "NEW"
  };
}

export function simulationStep(step = 0) {
  const orders = demoOrders();
  const timeline = buildTimeline(orders);
  const index = Math.max(0, Math.min(Number(step), timeline.length - 1));
  const current = timeline[index];
  const queues = buildQueues(orders, current.states);
  const resources = findLatestResources(timeline, index);
  return {
    step: index,
    totalSteps: timeline.length,
    currentEvent: current.message,
    concept: current.concept,
    operation: current.operation,
    explanation: current.explanation,
    queues,
    resources,
    buffer: current.buffer,
    mutex: current.mutex,
    schedulerDecision: current.schedulerDecision,
    deadlock: current.deadlock,
    eventLog: timeline.slice(0, index + 1).map((item, i) => ({ time: i, message: item.message }))
  };
}

function findLatestResources(timeline, index) {
  const defaultResources = { Stove: 2, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 };
  for (let i = index; i >= 0; i -= 1) {
    if (timeline[i].resources) return timeline[i].resources;
  }
  return defaultResources;
}

function buildQueues(orders, states) {
  const decorated = orders.map((order) => ({ ...order, state: states[order.id] || "NEW" }));
  return {
    newOrders: decorated.filter((order) => order.state === "NEW"),
    ready: decorated.filter((order) => order.state === "READY"),
    cooking: decorated.filter((order) => order.state === "COOKING"),
    waiting: decorated.filter((order) => order.state === "WAITING FOR RESOURCE"),
    completed: decorated.filter((order) => order.state === "COMPLETED")
  };
}

function baseStates(overrides = {}) {
  return {
    "O-101": "NEW",
    "O-102": "NEW",
    "O-103": "NEW",
    "O-104": "NEW",
    "O-105": "NEW",
    "O-106": "NEW",
    "O-107": "NEW",
    ...overrides
  };
}

function buildTimeline() {
  return [
    {
      concept: "Process Creation",
      operation: "Order arrival",
      message: "Time 0: Pasta order arrived and entered NEW state",
      explanation: "A food order is created as a process with arrival time, cooking time, priority, resources, ingredients, and recipe pages.",
      states: baseStates()
    },
    {
      concept: "Ready Queue",
      operation: "Admit process",
      message: "Time 1: Pasta moved from NEW to READY queue",
      explanation: "The kitchen order manager admits the arrived process into the ready queue.",
      states: baseStates({ "O-101": "READY" })
    },
    {
      concept: "CPU Scheduling",
      operation: "FCFS selection",
      message: "Time 2: Scheduler selected Pasta using FCFS",
      explanation: "FCFS selects Pasta because it arrived first at time 0.",
      states: baseStates({ "O-101": "READY", "O-102": "READY" }),
      schedulerDecision: {
        algorithm: "FCFS",
        selectedOrder: "Pasta",
        reason: "Pasta arrived first at time 0.",
        readyQueue: ["Pasta", "Pizza"],
        chefAssigned: "Chef 1"
      }
    },
    {
      concept: "Running State",
      operation: "Chef dispatch",
      message: "Time 3: Chef 1 assigned Pasta and Pasta entered COOKING state",
      explanation: "The chef is the CPU. Dispatch moves the selected process from ready to running.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY" }),
      schedulerDecision: {
        algorithm: "FCFS",
        selectedOrder: "Pasta",
        reason: "Pasta is dispatched to Chef 1.",
        readyQueue: ["Pizza", "Sandwich"],
        chefAssigned: "Chef 1"
      }
    },
    {
      concept: "Semaphore",
      operation: "wait(Stove)",
      message: "Time 4: wait(Stove), Stove Semaphore 2 -> 1",
      explanation: "Pasta needs a stove. The semaphore count decreases from 2 to 1, proving resource allocation.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY" }),
      resources: { Stove: 1, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 }
    },
    {
      concept: "Producer-Consumer",
      operation: "Produce order",
      message: "Time 5: Customer produced Burger into order buffer using wait(empty), wait(mutex), signal(full)",
      explanation: "Customers and waiters are producers. Chefs are consumers. The order buffer is protected by semaphores.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY", "O-104": "READY" }),
      buffer: { items: ["Pizza", "Sandwich", "Burger"], empty: 1, full: 3, size: 4 }
    },
    {
      concept: "Mutex",
      operation: "Lock critical section",
      message: "Time 6: Inventory mutex acquired by Pasta",
      explanation: "Only one process may update inventory. The mutex lock protects the critical section.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY", "O-104": "READY" }),
      mutex: { locked: true, owner: "Pasta", criticalSection: "Updating Pasta inventory", before: 10, after: 9, ingredient: "Pasta" }
    },
    {
      concept: "Critical Section",
      operation: "Unlock",
      message: "Time 7: Pasta inventory updated, Pasta 10 -> 9, mutex released",
      explanation: "The update completes before the next order enters the critical section.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY", "O-104": "READY" }),
      mutex: { locked: false, owner: null, criticalSection: "Pasta update finished", before: 10, after: 9, ingredient: "Pasta" }
    },
    {
      concept: "Waiting Queue",
      operation: "Resource unavailable",
      message: "Time 8: Cake needs Oven while Pizza holds Oven, Cake moved to WAITING FOR RESOURCE",
      explanation: "A process that cannot acquire a required resource leaves ready/running and waits.",
      states: baseStates({ "O-101": "COOKING", "O-102": "COOKING", "O-103": "READY", "O-104": "READY", "O-107": "WAITING FOR RESOURCE" }),
      resources: { Stove: 1, Oven: 0, Fryer: 1, Counter: 1, Mixer: 1 }
    },
    {
      concept: "Deadlock Detection",
      operation: "Cycle found",
      message: "Time 9: Deadlock detected: Order A -> Mixer -> Order B -> Oven -> Order A",
      explanation: "The resource allocation graph contains a circular wait, so deadlock is detected.",
      states: baseStates({ "O-101": "COOKING", "O-102": "COOKING", "O-103": "READY", "O-104": "READY", "O-107": "WAITING FOR RESOURCE" }),
      deadlock: {
        detected: true,
        cycle: ["Order A", "Mixer", "Order B", "Oven", "Order A"],
        edges: ["Oven -> Order A", "Order A -> Mixer", "Mixer -> Order B", "Order B -> Oven"]
      }
    },
    {
      concept: "Completion",
      operation: "Signal resources",
      message: "Time 10: Pasta and Pizza completed, signal(Stove), signal(Oven), completed queue updated",
      explanation: "Completed processes release resources and move into the completed queue.",
      states: baseStates({ "O-101": "COMPLETED", "O-102": "COMPLETED", "O-103": "COOKING", "O-104": "READY", "O-105": "READY", "O-106": "READY", "O-107": "READY" }),
      resources: { Stove: 2, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 }
    }
  ];
}
