import { useEffect, useState } from "react";
import { post } from "../lib/api.js";
import { Badge, EventLog, Page, Panel, Stat } from "../components/UI.jsx";

export default function Synchronization() {
  const [pc, setPc] = useState(null);
  const [mutex, setMutex] = useState(null);
  useEffect(() => { post("/sync/producer-consumer").then(setPc); post("/sync/mutex-demo").then(setMutex); }, []);
  return (
    <Page title="Synchronization" subtitle="Producer-consumer uses empty/full/mutex semaphores; inventory updates use a mutex-protected critical section." actions={<><button onClick={() => post("/sync/producer-consumer").then(setPc)}>Producer Consumer</button><button onClick={() => post("/sync/mutex-demo").then(setMutex)}>Mutex Demo</button></>}>
      <div className="stats-grid"><Stat label="Produced Orders" value={pc?.producedOrders || 0} /><Stat label="Consumed Orders" value={pc?.consumedOrders || 0} /><Stat label="Empty Slots" value={pc?.emptySlots || 0} /><Stat label="Full Slots" value={pc?.fullSlots || 0} /></div>
      <Panel title="Producer -> Buffer -> Chef -> Completed"><div className="flow"><Badge>Customer / Waiter</Badge><span>{"v"}</span><Badge>Order Buffer</Badge><span>{"v"}</span><Badge>Chef</Badge><span>{"v"}</span><Badge>Completed Order</Badge></div></Panel>
      <div className="grid two">
        <Panel title="Producer-Consumer Log"><EventLog events={pc?.eventLog || []} /></Panel>
        <Panel title="Mutex and Critical Section">{mutex?.steps.map((s, i) => <div className="mutex-step" key={i}><Badge tone="green">Mutex Lock: Acquired</Badge><strong>{s.criticalSection}</strong><p>{s.ingredient}: {s.before} {"->"} {s.after}</p><Badge tone="violet">Mutex Lock: Released</Badge></div>)}</Panel>
      </div>
    </Page>
  );
}
