import { useEffect, useState } from "react";
import { post } from "../lib/api.js";
import { EventLog, Gantt, Page, Panel, Stat } from "../components/UI.jsx";

export default function Report() {
  const [schedule, setSchedule] = useState(null);
  useEffect(() => { post("/scheduler/run", { algorithm: "FCFS", chefs: 2 }).then(setSchedule); }, []);
  return (
    <Page title="Printable Report" subtitle="Project Name, problem statement, selected algorithm, tables, Gantt chart, metrics, event log, concepts, and conclusion." actions={<button onClick={() => window.print()}>Print Report</button>}>
      <Panel title="Project Name"><h3>KitchenFlow OS: Smart Restaurant Kitchen Management System Using Operating System Concepts</h3><p>This project maps core OS mechanisms to a real restaurant kitchen so each concept is visible as a working simulation.</p></Panel>
      <Panel title="Problem Statement"><p>Build an offline web system that demonstrates CPU scheduling, producer-consumer, semaphore, mutex, critical section, deadlock detection, process states, queues, context switching, Gantt charts, and performance metrics.</p></Panel>
      <Panel title="Selected Algorithm and Gantt Chart"><Gantt blocks={schedule?.ganttChart || []} /></Panel>
      <div className="stats-grid">{Object.entries(schedule?.metrics || {}).map(([k, v]) => <Stat key={k} label={k} value={v} />)}</div>
      <Panel title="Event Log"><EventLog events={schedule?.eventLog || []} /></Panel>
      <Panel title="Conclusion"><p>KitchenFlow OS proves that classical OS concepts can be implemented as backend algorithms and visually demonstrated through restaurant kitchen queues, resource locks, scheduling decisions, and step-by-step logs.</p></Panel>
    </Page>
  );
}
