import { Activity, BarChart3, BookOpen, ChefHat, Cpu, FileText, Home, Lock, Package, Route } from "lucide-react";

const nav = [
  ["Dashboard", Home],
  ["Orders", ChefHat],
  ["Scheduler", Cpu],
  ["Resources", Package],
  ["Synchronization", Lock],
  ["Deadlock", Route],
  ["Analytics", BarChart3],
  ["OS Concepts", BookOpen],
  ["Demo", Activity],
  ["Report", FileText]
];

export default function Layout({ page, setPage, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><Cpu size={28} /><div><strong>KitchenFlow OS</strong><span>Restaurant kernel lab</span></div></div>
        <nav>
          {nav.map(([label, Icon]) => (
            <button key={label} className={page === label ? "active" : ""} onClick={() => setPage(label)} title={label}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
