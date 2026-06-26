import { useEffect, useState } from "react";
import { api, post } from "../lib/api.js";
import { Badge, Page, Panel, Queue } from "../components/UI.jsx";

const foods = ["Pizza", "Pasta", "Burger", "Sandwich", "French Fries", "VIP Special Order", "Cake"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ foodItem: "Pizza", orderType: "Dine-in", customerName: "Guest", arrivalTime: 0, cookingTime: 8, priority: 3 });
  const load = () => api("/orders").then(setOrders);
  useEffect(load, []);
  const create = async (e) => { e.preventDefault(); await post("/orders", { ...form, requiredResources: ["Stove"], requiredIngredients: ["Cheese", "Oil"] }); load(); };
  return (
    <Page title="Order Management" subtitle="Food orders are OS processes with arrival time, burst time, priority, resources, ingredients, and recipe pages." actions={<button onClick={() => post("/simulation/demo-data").then((r) => setOrders(r.orders))}>Load Demo Orders</button>}>
      <div className="grid two">
        <Panel title="Create Process / Food Order">
          <form className="form" onSubmit={create}>
            <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Customer Name" />
            <select value={form.foodItem} onChange={(e) => setForm({ ...form, foodItem: e.target.value })}>{foods.map((f) => <option key={f}>{f}</option>)}</select>
            <select value={form.orderType} onChange={(e) => setForm({ ...form, orderType: e.target.value })}>{["Dine-in", "Takeaway", "Delivery", "VIP"].map((t) => <option key={t}>{t}</option>)}</select>
            <input type="number" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} placeholder="Arrival Time" />
            <input type="number" value={form.cookingTime} onChange={(e) => setForm({ ...form, cookingTime: e.target.value })} placeholder="Cooking Time" />
            <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} placeholder="Priority" />
            <button>Create Order</button>
          </form>
        </Panel>
        <Panel title="Order Table">
          <div className="table">{orders.map((order) => <div className="row" key={order.id}><span>{order.id}</span><strong>{order.foodItem}</strong><Badge>{order.state}</Badge><span>AT {order.arrivalTime}</span><span>BT {order.cookingTime}</span><span>P{order.priority}</span></div>)}</div>
        </Panel>
      </div>
      <div className="queue-grid"><Queue title="New Orders" items={orders} /><Queue title="Ready Queue" items={orders.slice(0, 3)} tone="green" /><Queue title="Cooking" items={orders.slice(3, 4)} tone="amber" /><Queue title="Waiting for Resource" items={orders.slice(5, 6)} tone="red" /><Queue title="Completed" items={orders.slice(0, 1)} tone="violet" /></div>
    </Page>
  );
}
