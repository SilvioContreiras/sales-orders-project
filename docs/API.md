# Mocked API reference

All endpoints are served by MSW under the base path `/api` (configurable via
`VITE_API_BASE_URL`). Errors follow a common shape:

```json
{ "message": "human readable", "code": "MACHINE_CODE", "details": null }
```

Common status codes: `200` OK, `201` Created, `404` Not found, `422` Business-rule violation.

## Customers

| Method | Path             | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/customers`     | List (optional `?q=` search) |
| GET    | `/customers/:id` | Get one                      |
| POST   | `/customers`     | Create (unique `document`)   |
| PUT    | `/customers/:id` | Update                       |

## Transport types

| Method | Path                   | Description            |
| ------ | ---------------------- | ---------------------- |
| GET    | `/transport-types`     | List                   |
| GET    | `/transport-types/:id` | Get one                |
| POST   | `/transport-types`     | Create (unique `code`) |
| PUT    | `/transport-types/:id` | Update                 |

## Items

| Method | Path         | Description                  |
| ------ | ------------ | ---------------------------- |
| GET    | `/items`     | List (optional `?q=` search) |
| GET    | `/items/:id` | Get one                      |
| POST   | `/items`     | Create (unique `sku`)        |

## Sales orders

| Method | Path                                 | Description                                                                        |
| ------ | ------------------------------------ | ---------------------------------------------------------------------------------- |
| GET    | `/sales-orders`                      | List with filters: `status`, `customerId`, `transportTypeId`, `dateFrom`, `dateTo` |
| GET    | `/sales-orders/:id`                  | Get one                                                                            |
| POST   | `/sales-orders`                      | Create (validates customer, transport authorization, ≥1 item)                      |
| PATCH  | `/sales-orders/:id/status`           | Advance status (validated by the state machine)                                    |
| PUT    | `/sales-orders/:id/schedule`         | Set/update delivery date + window (unconfirmed)                                    |
| POST   | `/sales-orders/:id/schedule/confirm` | Confirm schedule (transitions `PLANNED → SCHEDULED`)                               |
| PUT    | `/sales-orders/:id/transport`        | Change transport (must be authorized; before dispatch)                             |

### Relevant business-rule codes

- `TRANSPORT_NOT_AUTHORIZED` — transport type not authorized for the customer
- `NO_ITEMS` — order has no items
- `INVALID_TRANSITION` — status transition not allowed by the state machine
- `SCHEDULE_REQUIRED` — cannot reach `SCHEDULED` without a confirmed schedule
- `TRANSPORT_LOCKED` — transport cannot change after dispatch

## Audit events

| Method | Path            | Description                              |
| ------ | --------------- | ---------------------------------------- |
| GET    | `/audit-events` | List (optional `?entityId=`, `?action=`) |
| POST   | `/audit-events` | Record an event (used by the audit saga) |
