export function producerConsumerDemo(bufferSize = 4) {
  const buffer = [];
  let empty = bufferSize;
  let full = 0;
  const eventLog = [];
  const steps = [];
  const produce = (order) => {
    eventLog.push({ message: "wait(empty)" }, { message: "wait(mutex)" });
    if (empty === 0) {
      eventLog.push({ message: `${order} waits because buffer is full` });
      steps.push(snapshot("producer-wait", order));
      return;
    }
    empty -= 1;
    buffer.push(order);
    full += 1;
    eventLog.push({ message: `Add ${order} to buffer` }, { message: "signal(mutex)" }, { message: "signal(full)" });
    steps.push(snapshot("produced", order));
  };
  const consume = () => {
    eventLog.push({ message: "wait(full)" }, { message: "wait(mutex)" });
    if (full === 0) {
      eventLog.push({ message: "Chef waits because buffer is empty" });
      steps.push(snapshot("consumer-wait", null));
      return;
    }
    const order = buffer.shift();
    full -= 1;
    empty += 1;
    eventLog.push({ message: `Chef consumed ${order}` }, { message: "signal(mutex)" }, { message: "signal(empty)" });
    steps.push(snapshot("consumed", order));
  };
  const snapshot = (action, order) => ({ action, order, buffer: [...buffer], bufferSize, empty, full });
  ["Pasta", "Pizza", "Burger", "Cake", "VIP Special"].forEach(produce);
  consume();
  consume();
  return { producedOrders: 5, consumedOrders: 2, bufferSize, emptySlots: empty, fullSlots: full, steps, eventLog };
}
