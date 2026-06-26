export const defaultResources = { Stove: 2, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 };

export function allocate(resources, order) {
  const next = { ...resources };
  const eventLog = [];
  for (const resource of order.requiredResources || []) {
    if ((next[resource] || 0) <= 0) {
      eventLog.push({ message: `${order.foodItem} waits because ${resource} is unavailable` });
      return { allocated: false, resources: next, state: "WAITING FOR RESOURCE", eventLog };
    }
    const before = next[resource];
    next[resource] -= 1;
    eventLog.push({ message: `wait(${resource}), ${resource} Semaphore ${before} -> ${next[resource]}` });
  }
  return { allocated: true, resources: next, state: "COOKING", eventLog };
}

export function release(resources, order) {
  const next = { ...resources };
  const eventLog = [];
  for (const resource of order.requiredResources || []) {
    const before = next[resource] || 0;
    next[resource] = before + 1;
    eventLog.push({ message: `signal(${resource}), ${resource} Semaphore ${before} -> ${next[resource]}` });
  }
  return { resources: next, eventLog };
}
