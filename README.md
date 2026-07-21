# OVGS — Sales Order Management System

A frontend application for managing the full lifecycle of **Sales Orders**:
master data, order creation, operational state machine, delivery scheduling,
operational monitoring, and audit trail.

The backend is **simulated with MSW**, so the application runs end to end without external services.
The REST boundary is realistic and can be swapped for a real API by changing the configuration.

---

## Tech stack

| Area         | Choice                                        |
| ------------ | --------------------------------------------- |
| UI           | React 19 + Tailwind CSS v4                    |
| Build        | Vite + TypeScript                             |
| Routing      | TanStack Router                               |
| Server state | TanStack Query                                |
| Global state | Redux Toolkit + Redux Saga                    |
| Forms        | React Hook Form + Zod                         |
| HTTP / mocks | Axios + MSW                                   |
| Testing      | Vitest + React Testing Library                |
| Quality      | ESLint, Prettier, Husky, lint-staged          |
| Delivery     | Docker (multi-stage) + Docker Compose + nginx |
| CI/CD        | GitHub Actions → GHCR                         |

CI builds and tests on push/PR to `main`; CD publishes the Docker image to GHCR. See [`.github/workflows/`](.github/workflows/).

---

## Getting started

**Requirements:** Node.js 20+ (developed on Node 22 — see `.nvmrc`) and npm 10+.

```bash
nvm use
npm install
npm run dev
# → http://localhost:5173
```

The simulated API starts automatically. Seed data (customers, transports, items, and orders)
is available on first load.

Useful scripts: `npm run build`, `npm run test`, `npm run lint`, `npm run typecheck`.

### Docker

```bash
docker compose up --build
# → http://localhost:8080
```

Requires Docker Desktop running.

---

## Project structure

Feature-based architecture: `features` and `app` depend on `shared`.

```
src/
├── app/          # Shell (config, layout, providers, router, store)
├── shared/       # API client, UI kit, types, utils
├── features/     # Modules (dashboard, customers, sales-orders, scheduling, ...)
├── mocks/        # MSW: in-memory database, seed, and handlers
└── tests/        # Test setup and helpers
```

Each feature typically exposes: `api.ts`, `queries.ts`, `schema.ts`, `domain/`, and `components/`.

## Features

- **Sales Orders** — create, list, detail; advance status; change transport
- **Scheduling Hub** — delivery date/window, confirm and reschedule
- **Monitoring** — filters by status, customer, transport, and dates
- **Dashboard** — metrics by status and recent orders
- **Master Data** — customers, transport types, items
- **Audit Trail** — chronological log of relevant changes

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — domain, rules, state machine, decisions,
  persistence, testing, scalability, performance, and trade-offs
- [Simulated API](docs/API.md) — MSW endpoints and business-rule codes

---

## License

Technical challenge — not licensed for production use.
