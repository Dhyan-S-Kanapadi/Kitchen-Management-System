import { useEffect, useState } from "react";
import { post } from "../lib/api.js";
import { Badge, EventLog, Page, Panel } from "../components/UI.jsx";

export default function Deadlock() {
  const [data, setData] = useState(null);
  useEffect(() => { post("/deadlock/demo").then(setData); }, []);
  return (
    <Page title="Deadlock Detection" subtitle="Resource allocation graph proves circular wait between two kitchen orders." actions={<button onClick={() => post("/deadlock/demo").then(setData)}>Detect Deadlock</button>}>
      <Panel title="Resource Allocation Graph">
        <div className="rag">{data?.edges.map((e, i) => <div className="edge" key={i}><Badge tone={data.cycle.includes(e.from) ? "red" : "blue"}>{e.from}</Badge><span>{e.type === "allocation" ? "allocates to" : "waits for"}</span><Badge tone={data.cycle.includes(e.to) ? "red" : "blue"}>{e.to}</Badge></div>)}</div>
        <h3 className="danger">Deadlock Detected: {data?.cycle.join(" -> ")}</h3>
      </Panel>
      <div className="grid two">
        <Panel title="Coffman Conditions">{data?.coffmanConditions.map((c) => <div className="decision" key={c.name}><strong>{c.name}</strong><p>{c.proof}</p></div>)}</Panel>
        <Panel title="Deadlock Event Log"><EventLog events={data?.eventLog || []} /></Panel>
      </div>
      <Panel title="Resolution Options"><div className="concept-grid">{["Cancel one order", "Preempt one resource", "Release resources", "Reorder resource allocation"].map((r) => <button className="concept-card" key={r}>{r}</button>)}</div></Panel>
    </Page>
  );
}
