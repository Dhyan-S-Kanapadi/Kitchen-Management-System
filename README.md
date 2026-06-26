# KitchenFlow OS

KitchenFlow OS is a full-stack Operating Systems project that demonstrates core OS concepts through a realistic restaurant kitchen management simulation. It is designed for a college OS viva or project demo where the evaluator can ask how concepts like CPU scheduling, semaphores, mutexes, producer-consumer synchronization, and deadlock detection are implemented in a working system.

The project intentionally focuses on only five OS topics:

1. CPU Scheduling
2. Producer-Consumer Problem
3. Semaphore
4. Mutex / Critical Section
5. Deadlock Detection

## Project Idea

In KitchenFlow OS, a restaurant kitchen behaves like an operating system:

- Food orders behave like processes.
- Chefs behave like CPUs.
- Cooking time behaves like burst time.
- Order time behaves like arrival time.
- Pending orders form the ready queue.
- Orders waiting for equipment form the waiting queue.
- Stoves, ovens, fryers, counters, and mixers behave like shared resources.
- Resource availability is controlled using semaphores.
- Inventory updates are protected using a mutex.
- Deadlock is detected when two orders hold resources and wait for each other.

This makes the OS concepts easier to explain because each algorithm has a visible kitchen meaning.

## OS Mapping

| Operating System Concept | KitchenFlow OS Mapping |
| --- | --- |
| Process | Food Order |
| CPU | Chef |
| Burst Time | Cooking Time |
| Arrival Time | Order Time |
| Priority | VIP / Delivery / Urgent order priority |
| Ready Queue | Pending order queue |
| Running State | Cooking state |
| Waiting Queue | Waiting for stove, oven, fryer, counter, or mixer |
| Completed State | Completed order |
| Scheduler | Kitchen order manager |
| Time Quantum | Cooking time slot |
| Semaphore | Available kitchen equipment count |
| Mutex | Inventory update lock |
| Critical Section | Updating inventory or order status |
| Deadlock | Orders waiting for each other's resources |
| Producer | Customer / waiter creating orders |
| Consumer | Chef consuming orders |
| Buffer | Order queue |

## Features

### 1. CPU Scheduling

The scheduler page demonstrates how a kitchen manager decides which food order should be cooked next.

Implemented algorithms:

- FCFS
- SJF
- Priority Scheduling
- Round Robin

The frontend displays:

- Ready queue
- Cooking queue
- Waiting queue
- Completed queue
- Gantt chart
- Scheduler decision explanation
- Waiting time
- Turnaround time
- Response time
- Throughput
- Chef utilization
- Context switch count

### 2. Producer-Consumer Problem

Customers and waiters produce orders, and chefs consume orders from a bounded order buffer.

The demo shows:

- Producer
- Order buffer
- Consumer
- Empty slots
- Full slots
- `wait(empty)`
- `wait(mutex)`
- `signal(mutex)`
- `signal(full)`

### 3. Semaphore

Kitchen equipment is limited. Semaphores control access to resources such as:

- Stove
- Oven
- Fryer
- Counter
- Mixer

Example:

- Pizza requests Oven.
- Oven semaphore changes from `1 -> 0`.
- Cake requests Oven while it is unavailable.
- Cake moves to waiting queue.
- Pizza completes and releases Oven.
- Oven semaphore changes from `0 -> 1`.

### 4. Mutex / Critical Section

Inventory is shared data. Only one order should update inventory at a time.

The project demonstrates:

- Mutex lock acquired
- Critical section entered
- Inventory value updated
- Mutex lock released

Example:

```text
Mutex Lock: Acquired by Pasta
Critical Section: Updating Pasta inventory
Pasta: 10 -> 9
Mutex Lock: Released
```

### 5. Deadlock Detection

The deadlock page demonstrates a resource allocation graph.

Scenario:

- Order A holds Oven and waits for Mixer.
- Order B holds Mixer and waits for Oven.

Cycle:

```text
Order A -> Mixer -> Order B -> Oven -> Order A
```

The page also explains the Coffman conditions:

- Mutual Exclusion
- Hold and Wait
- No Preemption
- Circular Wait

## Single-Page Demo Mode

The Demo page shows all five OS concepts on one screen.

It includes:

- Auto demo controls
- Current OS operation
- All five concept cards
- Live process queues
- CPU scheduling Gantt chart
- Producer-consumer proof panel
- Semaphore proof panel
- Mutex / critical section proof panel
- Deadlock detection proof panel
- Complete event log

Click `Start Auto Demo` to automatically walk through the complete simulation without manually opening separate pages.

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide React icons

### Backend

- Node.js
- Express.js

### Storage

- In-memory storage
- Local JSON seed files

No database, authentication, payment system, external API, Prisma, MongoDB, or AI API is required.

## Project Structure

```text
KitchenFlowOS/
  backend/
    server.js
    routes/
    services/
    data/
  frontend/
    src/
      components/
      pages/
      lib/
  docs/
  start-kitchenflow.ps1
  README.md
```

## How To Run The Project

### Prerequisites

Install:

- Node.js
- npm

Recommended Node version:

```text
Node.js 18 or newer
```

## One-Command Run On Windows

From PowerShell, run:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\Kitchen management system(os)\KitchenFlowOS\start-kitchenflow.ps1"
```

This script:

- Stops any old process using port `5000`
- Stops any old process using port `5173`
- Starts the backend
- Starts the frontend

Then open:

```text
http://localhost:5173
```

## Manual Run

Open two terminals.

### Terminal 1: Backend

```powershell
cd "D:\Kitchen management system(os)\KitchenFlowOS\backend"
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Terminal 2: Frontend

```powershell
cd "D:\Kitchen management system(os)\KitchenFlowOS\frontend"
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Useful Commands

Build frontend:

```powershell
cd "D:\Kitchen management system(os)\KitchenFlowOS\frontend"
npm run build
```

Start backend only:

```powershell
cd "D:\Kitchen management system(os)\KitchenFlowOS\backend"
npm run dev
```

Stop a process using port `5000`:

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Stop a process using port `5173`:

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Main Backend APIs

```text
GET  /api/health
GET  /api/orders
POST /api/orders
PUT  /api/orders/:id
DELETE /api/orders/:id

POST /api/scheduler/run
POST /api/scheduler/compare

GET  /api/resources
POST /api/resources/configure
POST /api/resources/allocate
POST /api/resources/release

POST /api/sync/producer-consumer
POST /api/sync/mutex-demo
POST /api/sync/semaphore-demo

POST /api/deadlock/demo
POST /api/deadlock/detect
POST /api/deadlock/resolve

POST /api/simulation/demo-data
POST /api/simulation/start
POST /api/simulation/step
POST /api/simulation/reset
```

## Demo Script For Viva

1. Start the project.
2. Open `http://localhost:5173`.
3. Go to Demo.
4. Click `Start Auto Demo`.
5. Explain each visible panel:
   - CPU Scheduling
   - Producer-Consumer
   - Semaphore
   - Mutex / Critical Section
   - Deadlock Detection
6. Open Scheduler to compare FCFS, SJF, Priority, and Round Robin.
7. Open Synchronization to show producer-consumer and mutex logs.
8. Open Deadlock to show the resource allocation graph.
9. Open Report to print/export the project report.

## Conclusion

KitchenFlow OS demonstrates five core operating system concepts through a practical restaurant kitchen simulation. The project is fully offline, visually interactive, and designed so a professor can ask for any selected concept and see it working through queues, logs, charts, Gantt timelines, locks, semaphores, and deadlock graphs.
