# OVGS — Sales Order Management System

Frontend for managing the full lifecycle of Sales Orders (Ordens de Venda): registries,
order creation, operational state machine, delivery scheduling, monitoring and audit trail.

> Full architecture documentation, domain modeling strategy and trade-offs are expanded at the
> end of this README as the implementation progresses through its stages.

## Tech stack

- **React 19** + **Vite** + **TypeScript**
- **TanStack Router** — type-safe routing
- **TanStack Query (React Query)** — server-state management
- **Redux Toolkit** + **Redux Saga** — client/global state and audit side effects
- **Tailwind CSS v4** — styling
- **React Hook Form** + **Zod** — forms and validation
- **MSW (Mock Service Worker)** — mocked REST API
- **Axios** — HTTP client
- **Vitest** + **React Testing Library** — unit and integration tests
- **ESLint** + **Prettier** + **Husky** + **lint-staged** — code quality
- **Docker** + **Docker Compose** — containerized delivery

## Requirements

- **Node.js 20+** (project developed on Node 22 — see `.nvmrc`)
- npm 10+

## Getting started

```bash
# use the pinned Node version
nvm use

# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev
```

## Available scripts

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start the Vite dev server             |
| `npm run build`         | Type-check and build for production   |
| `npm run preview`       | Preview the production build locally  |
| `npm run lint`          | Run ESLint                            |
| `npm run format`        | Format the codebase with Prettier     |
| `npm run typecheck`     | Run the TypeScript compiler (no emit) |
| `npm run test`          | Run the test suite once               |
| `npm run test:watch`    | Run tests in watch mode               |
| `npm run test:coverage` | Run tests with coverage report        |

## Running with Docker

```bash
docker compose up --build
# app served at http://localhost:8080
```

## Project structure

```
src/
├── app/          # Application shell: providers, router, layouts, store, config
├── shared/       # Cross-cutting: api client, components, hooks, types, utils, validations
├── features/     # Feature modules (sales-orders, scheduling, customers, ...)
├── mocks/        # MSW handlers and in-memory database
└── tests/        # Test setup and integration tests
```

## License

Technical challenge — not licensed for production use.
