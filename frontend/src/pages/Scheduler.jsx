import { useEffect, useState } from "react";
import { post } from "../lib/api.js";
import { EventLog, Gantt, Page, Panel, Stat } from "../components/UI.jsx";

export default function Scheduler() {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [chefs, setChefs] = useState(2);
  const [quantum, setQuantum] = useState(4);
  const [result, setResult] = useState(null);
  const run = () => post("/scheduler/run", { algorithm, chefs, quantum }).then(setResult);
  useEffect(run, []);
  return (
    <Page title="Kitchen Scheduler" subtitle="Chef is CPU, food order is process, cooking time is burst time, and order time is arrival time." actions={<button onClick={run}>Run Scheduler</button>}>
      <div className="control-bar">
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>{["FCFS", "SJF", "Priority", "Round Robin"].map((a) => <option key={a}>{a}</option>)}</select>
        <select value={chefs} onChange={(e) => setChefs(Number(e.target.value))}>{[1, 2, 3].map((n) => <option key={n} value={n}>{n} chef{n > 1 ? "s" : ""}</option>)}</select>
        <input type="number" min="1" value={quantum} onChange={(e) => setQuantum(Number(e.target.value))} />
      </div>
      <Panel title="Animated Gantt Chart"><Gantt blocks={result?.ganttChart || []} /></Panel>
      <div className="stats-grid">{Object.entries(result?.metrics || {}).map(([k, v]) => <Stat key={k} label={k} value={v} />)}</div>
      <div className="grid two">
        <Panel title="Scheduler Decision Explanation">{(result?.explanationSteps || []).slice(0, 8).map((s, i) => <div className="decision" key={i}><strong>{s.selectedOrder}</strong><p>{s.reason}</p><span>{s.currentTime} · {s.chefAssigned}</span></div>)}</Panel>
        <Panel title="Step Event Log"><EventLog events={result?.eventLog || []} /></Panel>
      </div>
    </Page>
  );
}
