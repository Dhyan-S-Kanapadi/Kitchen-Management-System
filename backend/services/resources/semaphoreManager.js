export function semaphoreDemo(resources = { Stove: 2, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 }) {
  const values = { ...resources };
  const eventLog = [];
  const steps = [];
  const wait = (resource, order) => {
    const before = values[resource];
    if (before > 0) {
      values[resource] -= 1;
      eventLog.push({ message: `wait(${resource}), ${resource} Semaphore ${before} -> ${values[resource]}` });
      steps.push({ order, resource, action: "wait", before, after: values[resource], status: "allocated" });
    } else {
      eventLog.push({ message: `${resource} unavailable. ${order} moved to Waiting for Resource Queue` });
      steps.push({ order, resource, action: "wait", before, after: before, status: "waiting" });
    }
  };
  const signal = (resource, order) => {
    const before = values[resource];
    values[resource] += 1;
    eventLog.push({ message: `signal(${resource}), ${resource} Semaphore ${before} -> ${values[resource]}` });
    steps.push({ order, resource, action: "signal", before, after: values[resource], status: "released" });
  };
  wait("Oven", "Pizza");
  wait("Oven", "Cake");
  signal("Oven", "Pizza");
  wait("Oven", "Cake");
  return { initial: resources, final: values, steps, eventLog };
}
