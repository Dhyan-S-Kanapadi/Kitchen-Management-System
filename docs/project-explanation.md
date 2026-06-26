# Project Explanation

KitchenFlow OS is a full-stack simulation where backend services implement OS algorithms and frontend pages visualize them step by step.

The backend exposes Express APIs for orders, scheduling, resources, synchronization, deadlock, and simulation. Every algorithm returns event logs and explanation steps so the UI can prove the concept, not just display final answers.

The frontend uses a dark dashboard interface with animated order cards, queue panels, Gantt charts, resource allocation graph rows, event logs, and analytics charts.

The system runs offline. Data is seeded from local JSON and in-memory demo objects. No authentication, payment, database, external API, Prisma, or MongoDB is used.
