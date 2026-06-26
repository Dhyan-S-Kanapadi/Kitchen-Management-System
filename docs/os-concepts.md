# OS Concepts Used

KitchenFlow OS focuses on exactly five OS concepts that map cleanly to real kitchen operations: CPU Scheduling, Producer-Consumer Problem, Semaphore, Mutex / Critical Section, and Deadlock Detection.

## CPU Scheduling

Food orders are processes. Chefs are CPUs. Cooking time is burst time. Arrival time is order time. The scheduler supports FCFS, SJF, Priority Scheduling, and Round Robin.

## Producer-Consumer

Customers and waiters produce orders into an order buffer. Chefs consume orders from that buffer. The demo shows `empty`, `full`, and `mutex` semaphore operations.

## Semaphore

Kitchen resources have limited counts. `wait(resource)` decreases a count when available. `signal(resource)` releases it. Unavailable resources move orders to the waiting queue.

## Mutex and Critical Section

Inventory is shared data. Only one order may update inventory at a time. The critical section is shown as lock acquired, ingredient update, and lock released.

## Deadlock

Order A holds Oven and waits for Mixer. Order B holds Mixer and waits for Oven. The resource allocation graph contains a cycle, proving deadlock.
