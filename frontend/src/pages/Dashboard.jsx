import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { api, post } from "../lib/api.js";
import { conceptCards } from "../lib/demoData.js";
import { Badge, EventLog, Page, Panel, Queue, Stat } from "../components/UI.jsx";

export default function Dashboard({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [sim, setSim] = useState(null);
  useEffect(() => { api("/orders").then(setOrders); post("/simulation/start").then(setSim); }, []);
  const states = ["NEW", "READY", "COOKING", "WAITING FOR RESOURCE", "COMPLETED"].map((state) => ({ name: state, value: orders.filter((o) => o.state === state).length || (state === "NEW" ? orders.length : 0) }));
  return (
    <Page title="KitchenFlow OS" subtitle="Smart restaurant kitchen management system proving operating-system concepts." actions={<button onClick={() => setPage("Demo")}>Load Demo Scenario</button>}>
      <div className="stats-grid">
        <Stat label="Total Orders" value={orders.length} /><Stat label="OS Concepts" value="8" /><Stat label="Chefs / CPUs" value="1-3" /><Stat label="Offline APIs" value="34" />
      </div>
      <div className="grid two">
        <Panel title="Live Process Queues">
          <div className="queue-grid compact">
            <Queue title="Ready Queue" items={orders.slice(0, 3)} /><Queue title="Cooking" items={orders.slice(3, 4)} tone="green" /><Queue title="Waiting Queue" items={orders.slice(5, 6)} tone="amber" /><Queue title="Completed" items={orders.slice(0, 1)} tone="violet" />
          </div>
        </Panel>
        <Panel title="Order State Chart">
          <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={states} dataKey="value" nameKey="name" outerRadius={90}>{states.map((_, i) => <Cell key={i} fill={["#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#a78bfa"][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Visual Proof Sections">
        <div className="concept-grid">{conceptCards.map(([title, text]) => <button className="concept-card" onClick={() => setPage(title.includes("Deadlock") ? "Deadlock" : title.includes("Scheduling") ? "Demo" : title.includes("Producer") || title.includes("Mutex") ? "Synchronization" : "Resources")} key={title}><Badge>{title}</Badge><p>{text}</p></button>)}</div>
      </Panel>
      <div className="grid two">
        <Panel title="Recent Kernel Event Log"><EventLog events={sim?.eventLog || []} /></Panel>
        <Panel title="Algorithm Comparison Preview"><ResponsiveContainer width="100%" height={230}><BarChart data={[{ name: "FCFS", wait: 9 }, { name: "SJF", wait: 6 }, { name: "Priority", wait: 7 }, { name: "RR", wait: 8 }]}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="wait" fill="#38bdf8" /></BarChart></ResponsiveContainer></Panel>
      </div>
    </Page>
  );
}
