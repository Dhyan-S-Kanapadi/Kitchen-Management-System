export function mutexDemo(inventory = { Cheese: 20, Bread: 15, Pasta: 10, Sauce: 12, Dough: 10, Oil: 10 }) {
  const current = { ...inventory };
  const updates = [
    { order: "Pizza", ingredient: "Cheese", amount: 2 },
    { order: "Sandwich", ingredient: "Bread", amount: 2 },
    { order: "Pasta", ingredient: "Pasta", amount: 1 }
  ];
  const steps = [];
  const eventLog = [];
  for (const update of updates) {
    const before = current[update.ingredient];
    eventLog.push({ message: `Mutex Lock: Acquired by ${update.order}` });
    current[update.ingredient] -= update.amount;
    steps.push({ lock: "acquired", criticalSection: `Updating ${update.ingredient}`, ingredient: update.ingredient, before, after: current[update.ingredient], order: update.order });
    eventLog.push({ message: `Critical section updating ${update.ingredient}: ${before} -> ${current[update.ingredient]}` });
    eventLog.push({ message: `Mutex Lock: Released by ${update.order}` });
  }
  return { inventoryBefore: inventory, inventoryAfter: current, steps, eventLog };
}
