import { motion } from "framer-motion";

export function Page({ title, subtitle, children, actions }) {
  return (
    <section>
      <header className="page-head">
        <div><h1>{title}</h1><p>{subtitle}</p></div>
        <div className="actions">{actions}</div>
      </header>
      {children}
    </section>
  );
}

export function Panel({ title, children, className = "" }) {
  return <div className={`panel ${className}`}>{title && <h2>{title}</h2>}{children}</div>;
}

export function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
}

export function Badge({ children, tone = "blue" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Queue({ title, items = [], tone = "blue" }) {
  return (
    <Panel title={title}>
      <div className="queue">
        {items.map((item, index) => (
          <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} key={`${item.id || item.foodItem}-${index}`} className={`order-card ${tone}`}>
            <strong>{item.foodItem || item.order || item}</strong>
            <span>{item.customerName || item.state || "OS step"}</span>
          </motion.div>
        ))}
        {!items.length && <div className="empty">Idle</div>}
      </div>
    </Panel>
  );
}

export function EventLog({ events = [] }) {
  const normalized = events.map((event, index) => typeof event === "string" ? { time: index, message: event } : event);
  return <div className="log">{normalized.map((event, index) => <p key={index}><span>T{event.time ?? index}</span>{event.message}</p>)}</div>;
}

export function Gantt({ blocks = [] }) {
  const total = Math.max(...blocks.map((b) => b.end), 1);
  return (
    <div className="gantt">
      {blocks.map((block, index) => (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ flexGrow: Math.max(block.end - block.start, 1) / total }}
          className="gantt-block"
          key={`${block.orderId}-${index}`}
          title={`${block.algorithm}: ${block.start}-${block.end}`}
        >
          <strong>{block.orderName}</strong><span>{block.chef}</span><small>{block.start} - {block.end}</small>
        </motion.div>
      ))}
    </div>
  );
}
