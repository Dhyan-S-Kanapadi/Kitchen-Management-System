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
    semaphoreAction: current.semaphoreAction,
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
        chefAssigned: "Chef 1",
        arrivalTime: 0,
        burstTime: 12,
        currentTime: 2,
        waitingTime: 2,
        responseTime: 2,
        comparison: [
          { order: "Pasta", arrivalTime: 0, cookingTime: 12, selected: true },
          { order: "Pizza", arrivalTime: 1, cookingTime: 16, selected: false }
        ]
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
        chefAssigned: "Chef 1",
        arrivalTime: 0,
        burstTime: 12,
        currentTime: 3,
        waitingTime: 3,
        responseTime: 3,
        comparison: [
          { order: "Pasta", arrivalTime: 0, cookingTime: 12, selected: true },
          { order: "Pizza", arrivalTime: 1, cookingTime: 16, selected: false },
          { order: "Sandwich", arrivalTime: 2, cookingTime: 5, selected: false }
        ]
      }
    },
    {
      concept: "Semaphore",
      operation: "wait(Stove)",
      message: "Time 4: wait(Stove), Stove Semaphore 2 -> 1",
      explanation: "Pasta needs a stove. The semaphore count decreases from 2 to 1, proving resource allocation.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY" }),
      resources: { Stove: 1, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 },
      semaphoreAction: {
        operation: "wait(Stove)",
        resource: "Stove",
        before: 2,
        after: 1,
        order: "Pasta",
        result: "allocated",
        proof: "Semaphore count decreased because one stove was acquired."
      }
    },
    {
      concept: "Producer-Consumer",
      operation: "Produce order",
      message: "Time 5: Customer produced Burger into order buffer using wait(empty), wait(mutex), signal(full)",
      explanation: "Customers and waiters are producers. Chefs are consumers. The order buffer is protected by semaphores.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY", "O-104": "READY" }),
      buffer: {
        items: ["Pizza", "Sandwich", "Burger"],
        empty: 1,
        full: 3,
        mutex: 1,
        size: 4,
        producer: "Customer",
        consumer: "Chef",
        producedOrder: "Burger",
        operationSequence: ["wait(empty)", "wait(mutex)", "add Burger", "signal(mutex)", "signal(full)"],
        blockedProducer: "Cake waits because empty = 0 when buffer is full",
        proof: "empty decreased and full increased after the producer inserted an order."
      }
    },
    {
      concept: "Mutex",
      operation: "Lock critical section",
      message: "Time 6: Inventory mutex acquired by Pasta",
      explanation: "Only one process may update inventory. The mutex lock protects the critical section.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY", "O-104": "READY" }),
      mutex: {
        locked: true,
        owner: "Pasta",
        waitingOrders: ["Pizza", "Burger"],
        criticalSection: "Updating Pasta inventory",
        before: 10,
        after: 9,
        ingredient: "Pasta",
        lockSequence: ["lock(inventoryMutex)", "enter critical section", "Pasta: 10 -> 9"],
        proof: "Pizza and Burger cannot update inventory while Pasta owns the mutex."
      }
    },
    {
      concept: "Critical Section",
      operation: "Unlock",
      message: "Time 7: Pasta inventory updated, Pasta 10 -> 9, mutex released",
      explanation: "The update completes before the next order enters the critical section.",
      states: baseStates({ "O-101": "COOKING", "O-102": "READY", "O-103": "READY", "O-104": "READY" }),
      mutex: {
        locked: false,
        owner: null,
        waitingOrders: ["Pizza", "Burger"],
        nextOwner: "Pizza",
        criticalSection: "Pasta update finished",
        before: 10,
        after: 9,
        ingredient: "Pasta",
        lockSequence: ["exit critical section", "unlock(inventoryMutex)", "wake next waiting order"],
        proof: "The mutex is released only after the shared inventory update is complete."
      }
    },
    {
      concept: "Waiting Queue",
      operation: "Resource unavailable",
      message: "Time 8: Cake needs Oven while Pizza holds Oven, Cake moved to WAITING FOR RESOURCE",
      explanation: "A process that cannot acquire a required resource leaves ready/running and waits.",
      states: baseStates({ "O-101": "COOKING", "O-102": "COOKING", "O-103": "READY", "O-104": "READY", "O-107": "WAITING FOR RESOURCE" }),
      resources: { Stove: 1, Oven: 0, Fryer: 1, Counter: 1, Mixer: 1 },
      semaphoreAction: {
        operation: "wait(Oven)",
        resource: "Oven",
        before: 0,
        after: 0,
        order: "Cake",
        result: "blocked",
        proof: "Cake is moved to the waiting queue because Oven semaphore is zero."
      }
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
        nodes: ["Order A", "Order B", "Oven", "Mixer"],
        edges: [
          { from: "Oven", to: "Order A", type: "allocation" },
          { from: "Order A", to: "Mixer", type: "request" },
          { from: "Mixer", to: "Order B", type: "allocation" },
          { from: "Order B", to: "Oven", type: "request" }
        ],
        detectionSteps: [
          "Build resource allocation graph",
          "Follow request edge from Order A to Mixer",
          "Follow allocation edge from Mixer to Order B",
          "Follow request edge from Order B to Oven",
          "Follow allocation edge from Oven back to Order A"
        ],
        coffmanConditions: [
          "Mutual Exclusion: Oven and Mixer are single-instance resources",
          "Hold and Wait: each order holds one resource while requesting another",
          "No Preemption: resources are not forcibly taken during cooking",
          "Circular Wait: Order A -> Mixer -> Order B -> Oven -> Order A"
        ]
      }
    },
    {
      concept: "Completion",
      operation: "Signal resources",
      message: "Time 10: Pasta and Pizza completed, signal(Stove), signal(Oven), completed queue updated",
      explanation: "Completed processes release resources and move into the completed queue.",
      states: baseStates({ "O-101": "COMPLETED", "O-102": "COMPLETED", "O-103": "COOKING", "O-104": "READY", "O-105": "READY", "O-106": "READY", "O-107": "READY" }),
      resources: { Stove: 2, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 },
      semaphoreAction: {
        operation: "signal(Stove), signal(Oven)",
        resource: "Stove/Oven",
        before: "Stove 1, Oven 0",
        after: "Stove 2, Oven 1",
        order: "Pasta and Pizza",
        result: "released",
        proof: "Semaphore counts increase when completed orders release resources."
      }
    }
  ];
}
