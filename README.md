# OVGS — Sistema de Gestão de Ordens de Venda

Uma aplicação frontend para gerenciar todo o ciclo de vida das **Ordens de Venda**:
cadastros, criação de ordens, máquina de estados operacional, agendamento de entregas,
monitoramento operacional e trilha de auditoria.

O backend é **simulado com MSW**, então a aplicação roda de ponta a ponta sem serviços externos.
A fronteira REST é realista e pode ser trocada por uma API real alterando a configuração.

> Código, pastas e identificadores em **inglês**; textos de interface e documentação em **português**.

---

## Stack tecnológica

| Área               | Escolha                                       |
| ------------------ | --------------------------------------------- |
| UI                 | React 19 + Tailwind CSS v4                    |
| Build              | Vite + TypeScript                             |
| Roteamento         | TanStack Router                               |
| Estado do servidor | TanStack Query                                |
| Estado global      | Redux Toolkit + Redux Saga                    |
| Formulários        | React Hook Form + Zod                         |
| HTTP / mocks       | Axios + MSW                                   |
| Testes             | Vitest + React Testing Library                |
| Qualidade          | ESLint, Prettier, Husky, lint-staged          |
| Entrega            | Docker (multi-stage) + Docker Compose + nginx |

---

## Como começar

**Requisitos:** Node.js 20+ (desenvolvido no Node 22 — veja `.nvmrc`) e npm 10+.

```bash
nvm use
npm install
npm run dev
# → http://localhost:5173
```

A API simulada inicia automaticamente. Dados iniciais (clientes, transportes, itens e ordens)
já estão disponíveis no primeiro carregamento.

### Scripts

| Script                  | Descrição                       |
| ----------------------- | ------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento     |
| `npm run build`         | Build de produção               |
| `npm run preview`       | Pré-visualiza o build           |
| `npm run lint`          | ESLint                          |
| `npm run format`        | Prettier                        |
| `npm run typecheck`     | Verificação de tipos (`tsc -b`) |
| `npm run test`          | Testes                          |
| `npm run test:watch`    | Testes em modo watch            |
| `npm run test:coverage` | Testes com cobertura            |

### Docker

```bash
docker compose up --build
# → http://localhost:8080
```

Requer o Docker Desktop em execução. O Compose não abre o navegador automaticamente.

---

## Estrutura do projeto

Arquitetura baseada em funcionalidades: `features` e `app` dependem de `shared`.

```
src/
├── app/          # Shell (config, layout, providers, router, store)
├── shared/       # API client, UI kit, types, utils
├── features/     # Módulos (dashboard, customers, sales-orders, scheduling, ...)
├── mocks/        # MSW: banco em memória, seed e handlers
└── tests/        # Setup e helpers de teste
```

Cada feature tipicamente expõe: `api.ts`, `queries.ts`, `schema.ts`, `domain/` e `components/`.

## Funcionalidades

- **Ordens de Venda** — criar, listar, detalhar; avançar status; alterar transporte
- **Central de Agendamento** — data/janela de entrega, confirmar e reagendar
- **Monitoramento** — filtros por status, cliente, transporte e datas
- **Painel** — métricas por status e ordens recentes
- **Cadastros** — clientes, tipos de transporte, itens
- **Trilha de Auditoria** — registro cronológico das alterações relevantes

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md) — domínio, regras, máquina de estados, decisões,
  persistência, testes, escalabilidade, performance e trade-offs
- [API simulada](docs/API.md) — endpoints MSW e códigos de regra de negócio

---

## Licença

Desafio técnico — não licenciado para uso em produção.
