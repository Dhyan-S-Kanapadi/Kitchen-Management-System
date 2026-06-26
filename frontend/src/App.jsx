import { useState } from "react";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Scheduler from "./pages/Scheduler.jsx";
import Resources from "./pages/Resources.jsx";
import Synchronization from "./pages/Synchronization.jsx";
import Deadlock from "./pages/Deadlock.jsx";
import Analytics from "./pages/Analytics.jsx";
import Concepts from "./pages/Concepts.jsx";
import Demo from "./pages/Demo.jsx";
import Report from "./pages/Report.jsx";

const pages = { Dashboard, Orders, Scheduler, Resources, Synchronization, Deadlock, Analytics, "OS Concepts": Concepts, Demo, Report };

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const Current = pages[page];
  return <Layout page={page} setPage={setPage}><Current setPage={setPage} /></Layout>;
}
