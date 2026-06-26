import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, post } from "../lib/api.js";
import { Page, Panel, Stat } from "../components/UI.jsx";

export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const [comparison, setComparison] = useState([]);
  useEffect(() => {
    api("/orders").then(setOrders);
    post("/scheduler/compare", { chefs: 2 }).then((r) => setComparison(r.results));
  }, []);
  const stateData = ["NEW", "READY", "COOKING", "COMPLETED"].map((name) => ({ name, value: name === "NEW" ? orders.length : 1 }));
  return (
    <Page title="Analytics" subtitle="Performance metrics for scheduling, resources, process states, synchronization, and deadlock risk.">
      <div className="stats-grid"><Stat label="Total Orders" value={orders.length} /><Stat label="Pending Orders" value={orders.length} /><Stat label="Deadlock Count" value="1" /><Stat label="Resource Waits" value="3" /><Stat label="Context Switches" value={comparison[3]?.contextSwitches || 0} /><Stat label="Chef Utilization" value={`${comparison[0]?.metrics?.chefUtilization || 0}%`} /></div>
      <div className="grid two">
        <Panel title="Bar Chart Comparing Algorithms"><ResponsiveContainer width="100%" height={260}><BarChart data={comparison.map((r) => ({ name: r.algorithm, wait: r.metrics.averageWaitingTime, tat: r.metrics.averageTurnaroundTime }))}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="wait" fill="#38bdf8" /><Bar dataKey="tat" fill="#22c55e" /></BarChart></ResponsiveContainer></Panel>
        <Panel title="Pie Chart for Order States"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={stateData} dataKey="value" outerRadius={90}>{stateData.map((_, i) => <Cell key={i} fill={["#38bdf8", "#f59e0b", "#22c55e", "#a78bfa"][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Panel>
        <Panel title="Resource Utilization Chart"><ResponsiveContainer width="100%" height={260}><BarChart data={[{ name: "Stove", used: 68 }, { name: "Oven", used: 82 }, { name: "Fryer", used: 45 }, { name: "Counter", used: 60 }, { name: "Mixer", used: 55 }]}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="used" fill="#f59e0b" /></BarChart></ResponsiveContainer></Panel>
        <Panel title="Kitchen Risk Counts"><ResponsiveContainer width="100%" height={260}><BarChart data={[{ name: "Deadlock", count: 1 }, { name: "Resource Waits", count: 3 }, { name: "Mutex Updates", count: 3 }, { name: "Context Switches", count: comparison[3]?.contextSwitches || 0 }]}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#ef4444" /></BarChart></ResponsiveContainer></Panel>
      </div>
    </Page>
  );
}
