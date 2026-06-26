import { useEffect, useRef, useState } from "react";
import { post } from "../lib/api.js";
import { Badge, EventLog, Gantt, Page, Panel, Queue, Stat } from "../components/UI.jsx";

const defaultResources = { Stove: 2, Oven: 1, Fryer: 1, Counter: 2, Mixer: 1 };

export default function Demo() {
  const [sim, setSim] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [speed, setSpeed] = useState(1800);
  const timerRef = useRef(null);

  const start = async () => {
    try {
      stopAuto();
      setLoadError("");
      await post("/simulation/demo-data");
      setSim(await post("/simulation/start"));
      setSchedule(await post("/scheduler/run", { algorithm: "FCFS", chefs: 2 }));
    } catch (error) {
      setLoadError(error.message);
    }
  };

  const runAutoDemo = async () => {
    try {
      stopAuto();
      setLoadError("");
      await post("/simulation/demo-data");
      const firstStep = await post("/simulation/start");
      setSim(firstStep);
      setSchedule(await post("/scheduler/run", { algorithm: "FCFS", chefs: 2 }));
      setIsAutoRunning(true);
    } catch (error) {
      setLoadError(error.message);
    }
  };

  const stopAuto = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsAutoRunning(false);
  };

  const reset = async () => {
    try {
      stopAuto();
      setLoadError("");
      setSim(await post("/simulation/reset"));
    } catch (error) {
      setLoadError(error.message);
    }
  };

  const nextStep = async () => {
    try {
      stopAuto();
      setLoadError("");
      setSim(await post("/simulation/step"));
    } catch (error) {
      setLoadError(error.message);
    }
  };

  const previousStep = async () => {
    try {
      stopAuto();
      setLoadError("");
      setSim(await post("/simulation/previous"));
    } catch (error) {
      setLoadError(error.message);
    }
  };

  useEffect(() => { start(); }, []);
  useEffect(() => () => stopAuto(), []);
  useEffect(() => {
    if (!isAutoRunning || !sim) return;
    const isLastStep = sim.step >= sim.totalSteps - 1;
    if (isLastStep) {
      setIsAutoRunning(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      setSim(await post("/simulation/step"));
    }, speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAutoRunning, sim, speed]);

  return (
    <Page
      title="Demo Mode"
      subtitle="One guided scenario touches CPU scheduling, producer-consumer, semaphore, mutex, critical section, deadlock detection, metrics, and report data."
      actions={<><button onClick={runAutoDemo}>{isAutoRunning ? "Restart Auto Demo" : "Start Auto Demo"}</button><button onClick={stopAuto} disabled={!isAutoRunning}>Pause</button><button onClick={previousStep}>Previous Step</button><button onClick={nextStep}>Next Step</button><button onClick={reset}>Reset</button></>}
    >
      {loadError && <Panel title="Demo Error" className="error-panel"><p>{loadError}</p><p>Start the backend on port 5000, then reload this page.</p></Panel>}
      <Panel title="Auto Demo Controls">
        <div className="demo-controls">
          <div>
            <Badge tone={isAutoRunning ? "green" : "violet"}>{isAutoRunning ? "Auto Running" : "Paused"}</Badge>
            <p>The demo advances automatically through every OS proof step. Use this for viva instead of clicking each concept manually.</p>
          </div>
          <label>
            Speed
            <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
              <option value={2800}>Slow</option>
              <option value={1800}>Normal</option>
              <option value={900}>Fast</option>
            </select>
          </label>
        </div>
      </Panel>
      <Panel title="Current OS Operation">
        <div className="demo-focus">
          <div>
            <Badge tone="green">{sim?.concept || "Waiting"}</Badge>
            <h3>{sim?.operation}</h3>
            <p>{sim?.currentEvent}</p>
            <p>{sim?.explanation}</p>
          </div>
          <div className="step-meter">
            <strong>Step {(sim?.step ?? 0) + 1}</strong>
            <span>of {sim?.totalSteps || 1}</span>
          </div>
        </div>
      </Panel>
      <AlwaysVisibleSemaphore resources={sim?.resources} active={isActive(sim, ["Semaphore", "Waiting Queue", "Completion"])} />
      <ConceptOverview activeConcept={sim?.concept} />
      <div className="queue-grid"><Queue title="New Orders" items={sim?.queues?.newOrders || []} /><Queue title="Ready Queue" items={sim?.queues?.ready || []} tone="green" /><Queue title="Cooking" items={sim?.queues?.cooking || []} tone="amber" /><Queue title="Waiting" items={sim?.queues?.waiting || []} tone="red" /><Queue title="Completed" items={sim?.queues?.completed || []} tone="violet" /></div>
      <ConceptProofBoard sim={sim} schedule={schedule} />
      <Panel title="Complete Demo Event Log"><EventLog events={sim?.eventLog || []} /></Panel>
    </Page>
  );
}

const conceptMap = [
  {
    key: "CPU Scheduling",
    title: "CPU Scheduling",
    route: ["CPU Scheduling", "Running State", "Ready Queue", "Completion"],
    text: "Chef acts as CPU. Orders move through ready, cooking, waiting, and completed states."
  },
  {
    key: "Producer-Consumer",
    title: "Producer-Consumer Problem",
    route: ["Producer-Consumer"],
    text: "Customers/waiters produce orders into the bounded buffer. Chefs consume orders."
  },
  {
    key: "Semaphore",
    title: "Semaphore",
    route: ["Semaphore", "Waiting Queue", "Completion"],
    text: "Limited kitchen equipment is represented by semaphore counts and wait/signal actions."
  },
  {
    key: "Mutex",
    title: "Mutex / Critical Section",
    route: ["Mutex", "Critical Section"],
    text: "Inventory updates are protected so only one order enters the critical section."
  },
  {
    key: "Deadlock Detection",
    title: "Deadlock Detection",
    route: ["Deadlock Detection"],
    text: "The resource allocation graph detects a circular wait between orders and equipment."
  }
];

function ConceptOverview({ activeConcept }) {
  return (
    <Panel title="All Concepts In This Single Demo">
      <div className="single-demo-grid">
        {conceptMap.map((concept) => {
          const active = concept.route.includes(activeConcept);
          return (
            <div className={`single-demo-card ${active ? "active" : ""}`} key={concept.key}>
              <Badge tone={active ? "green" : "blue"}>{active ? "Live Step" : "Included"}</Badge>
              <strong>{concept.title}</strong>
              <p>{concept.text}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function ConceptProofBoard({ sim, schedule }) {
  return (
    <div className="concept-proof-grid">
      <Panel title="1. CPU Scheduling" className={isActive(sim, ["CPU Scheduling", "Ready Queue", "Running State", "Completion"]) ? "active-proof" : ""}>
        <ProofData sim={sim} />
        <Gantt blocks={schedule?.ganttChart || []} />
      </Panel>
      <Panel title="2. Producer-Consumer Problem" className={isActive(sim, ["Producer-Consumer"]) ? "active-proof" : ""}>
        <ProducerConsumerProof sim={sim} />
      </Panel>
      <Panel title="3. Semaphore" className={isActive(sim, ["Semaphore", "Waiting Queue", "Completion"]) ? "active-proof" : ""}>
        <SemaphoreProof sim={sim} />
      </Panel>
      <Panel title="4. Mutex / Critical Section" className={isActive(sim, ["Mutex", "Critical Section"]) ? "active-proof" : ""}>
        <MutexProof sim={sim} />
      </Panel>
      <Panel title="5. Deadlock Detection" className={isActive(sim, ["Deadlock Detection"]) ? "active-proof" : ""}>
        <DeadlockProof sim={sim} />
      </Panel>
    </div>
  );
}

function AlwaysVisibleSemaphore({ resources, active }) {
  const values = resources || defaultResources;
  return (
    <Panel title="Live Semaphore Values" className={active ? "active-proof" : ""}>
      <div className="stats-grid semaphore-grid">
        {Object.entries(values).map(([name, value]) => <Stat key={name} label={`${name} Semaphore`} value={value} />)}
      </div>
      <p>This semaphore panel stays visible throughout the demo. Values update when kitchen resources are allocated or released.</p>
    </Panel>
  );
}

function isActive(sim, concepts) {
  return concepts.includes(sim?.concept);
}

function ProofData({ sim }) {
  if (!sim) return <p>Load the demo to begin the operating-system proof timeline.</p>;
  if (sim.schedulerDecision) {
    return (
      <div className="proof-stack">
        <div className="stats-grid small">
          <Stat label="Algorithm" value={sim.schedulerDecision.algorithm} />
          <Stat label="Current Time" value={sim.schedulerDecision.currentTime} />
          <Stat label="Response Time" value={sim.schedulerDecision.responseTime} />
        </div>
        <p><strong>Selected Order:</strong> {sim.schedulerDecision.selectedOrder}</p>
        <p><strong>Reason:</strong> {sim.schedulerDecision.reason}</p>
        <p><strong>Ready Queue:</strong> {sim.schedulerDecision.readyQueue.join(", ")}</p>
        <p><strong>Chef Assigned:</strong> {sim.schedulerDecision.chefAssigned}</p>
        <div className="proof-table">
          {sim.schedulerDecision.comparison?.map((row) => (
            <div className={row.selected ? "proof-row selected" : "proof-row"} key={row.order}>
              <strong>{row.order}</strong><span>AT {row.arrivalTime}</span><span>BT {row.cookingTime}</span><Badge tone={row.selected ? "green" : "blue"}>{row.selected ? "Selected" : "Waiting"}</Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (["Ready Queue", "Running State", "Completion"].includes(sim.concept)) {
    return <div className="proof-stack"><p><strong>Current transition:</strong> {sim.currentEvent}</p><p>{sim.explanation}</p></div>;
  }
  return <p>Scheduling proof appears when the ready queue, dispatch, or completion step is active. The Gantt chart remains visible throughout the demo.</p>;
}

function ProducerConsumerProof({ sim }) {
  if (sim?.buffer) {
    return (
      <div className="proof-stack">
        <div className="flow"><Badge>{sim.buffer.producer}</Badge><span>{"v"}</span><Badge>Order Buffer</Badge><span>{"v"}</span><Badge>{sim.buffer.consumer}</Badge></div>
        <div className="stats-grid small"><Stat label="Buffer Size" value={sim.buffer.size} /><Stat label="Empty" value={sim.buffer.empty} /><Stat label="Full" value={sim.buffer.full} /><Stat label="Mutex" value={sim.buffer.mutex} /></div>
        <p><strong>Buffer:</strong> {sim.buffer.items.join(", ")}</p>
        <div className="operation-list">{sim.buffer.operationSequence.map((item) => <span key={item}>{item}</span>)}</div>
        <p>{sim.buffer.proof}</p>
      </div>
    );
  }
  return <p>When the demo reaches Producer-Consumer, a customer produces Burger into the bounded order buffer and the semaphore values update.</p>;
}

function SemaphoreProof({ sim }) {
  const values = sim?.resources || defaultResources;
  return (
    <div className="proof-stack">
      <div className="stats-grid small">{Object.entries(values).map(([name, value]) => <Stat key={name} label={`${name}`} value={value} />)}</div>
      {sim?.semaphoreAction ? (
        <div className={`semaphore-action ${sim.semaphoreAction.result}`}>
          <Badge tone={sim.semaphoreAction.result === "blocked" ? "red" : "green"}>{sim.semaphoreAction.operation}</Badge>
          <p><strong>Order:</strong> {sim.semaphoreAction.order}</p>
          <p><strong>Value:</strong> {sim.semaphoreAction.before} {"->"} {sim.semaphoreAction.after}</p>
          <p>{sim.semaphoreAction.proof}</p>
        </div>
      ) : <p>Semaphore values are ready before the simulation starts.</p>}
      <p>Resources use wait(resource) when allocated and signal(resource) when released.</p>
    </div>
  );
}

function MutexProof({ sim }) {
  if (sim?.mutex) {
    return (
      <div className="proof-stack">
        <Badge tone={sim.mutex.locked ? "green" : "violet"}>Mutex {sim.mutex.locked ? "Locked" : "Released"}</Badge>
        <p><strong>Owner:</strong> {sim.mutex.owner || "None"}</p>
        <p><strong>Waiting Orders:</strong> {sim.mutex.waitingOrders?.join(", ") || "None"}</p>
        {sim.mutex.nextOwner && <p><strong>Next Owner:</strong> {sim.mutex.nextOwner}</p>}
        <p><strong>Critical Section:</strong> {sim.mutex.criticalSection}</p>
        <p>{sim.mutex.ingredient}: {sim.mutex.before} {"->"} {sim.mutex.after}</p>
        <div className="operation-list">{sim.mutex.lockSequence?.map((item) => <span key={item}>{item}</span>)}</div>
        <p>{sim.mutex.proof}</p>
      </div>
    );
  }
  return <p>Mutex proof appears when Pasta updates inventory. The lock must be acquired before the critical section and released after the update.</p>;
}

function DeadlockProof({ sim }) {
  if (sim?.deadlock) {
    return (
      <div className="proof-stack">
        <Badge tone="red">Deadlock Detected</Badge>
        <p><strong>Cycle:</strong> {sim.deadlock.cycle.join(" -> ")}</p>
        <div className="rag-mini">
          {sim.deadlock.edges.map((edge) => <div className="rag-edge" key={`${edge.from}-${edge.to}`}><strong>{edge.from}</strong><span>{edge.type === "allocation" ? "allocated to" : "requests"}</span><strong>{edge.to}</strong></div>)}
        </div>
        <div className="operation-list">{sim.deadlock.detectionSteps.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="coffman-list">{sim.deadlock.coffmanConditions.map((item) => <p key={item}>{item}</p>)}</div>
      </div>
    );
  }
  return <p>Deadlock proof appears when the resource allocation graph has a circular wait: Order A waits for Mixer and Order B waits for Oven.</p>;
}
