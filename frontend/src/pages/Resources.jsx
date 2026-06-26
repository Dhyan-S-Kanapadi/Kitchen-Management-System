import { useEffect, useState } from "react";
import { api, post } from "../lib/api.js";
import { EventLog, Page, Panel, Stat } from "../components/UI.jsx";

export default function Resources() {
  const [resources, setResources] = useState({});
  const [demo, setDemo] = useState(null);
  useEffect(() => { api("/resources").then(setResources); post("/sync/semaphore-demo").then(setDemo); }, []);
  return (
    <Page title="Resource Manager" subtitle="Semaphores prove limited equipment allocation with wait and signal operations." actions={<button onClick={() => post("/sync/semaphore-demo").then(setDemo)}>Run Semaphore Demo</button>}>
      <div className="stats-grid">{Object.entries(resources).map(([name, value]) => <Stat key={name} label={`${name} Semaphore`} value={value} />)}</div>
      <div className="grid two">
        <Panel title="Semaphore Value Changes">{demo?.steps.map((s, i) => <div className={`resource-step ${s.status}`} key={i}><strong>{s.order}</strong><span>{s.action}({s.resource})</span><b>{s.before} {"->"} {s.after}</b></div>)}</Panel>
        <Panel title="Semaphore Event Log"><EventLog events={demo?.eventLog || []} /></Panel>
      </div>
    </Page>
  );
}
