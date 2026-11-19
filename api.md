# API Contract v1

**Base URL:** `http://localhost:8080/api`
**Format:** JSON in, JSON out. Dates are ISO 8601 (e.g. `2026-11-14T10:30:00`).
**Auth:** after login, send `Authorization: Bearer <token>` on every request marked "Yes" in the Auth column.

## Endpoints

| Method | URL | Auth | Request body | Success response | Errors |
|---|---|---|---|---|---|
| POST | `/auth/register` | No | `{ "email", "password" }` | `201` `{ "id", "email" }` | `400` invalid input, `409` email exists |
| POST | `/auth/login` | No | `{ "email", "password" }` | `200` `{ "token", "email" }` | `401` wrong credentials |
| GET | `/me` | Yes | none | `200` `{ "id", "email" }` | `401` |
| GET | `/simulations` | No | none | `200` list of `{ "code", "name", "category", "description", "formula" }` | none |
| POST | `/history` | Yes | `{ "simulationCode", "parameters": { ... } }` | `201` `{ "id", "simulationCode", "parameters", "viewedAt" }` | `400` bad input or unknown code, `401` |
| GET | `/history?limit=10` | Yes | none | `200` list of history entries, newest first (`limit` optional, default 10) | `401` |
| GET | `/history/last` *(optional)* | Yes | none | `200` one history entry | `401`, `404` no history yet |

## Examples

### POST `/auth/register`
```json
{ "email": "ahmed@example.com", "password": "mypassword123" }
```

### POST `/auth/login` response
```json
{ "token": "eyJhbGciOi...", "email": "ahmed@example.com" }
```

### GET `/simulations` response
```json
[
  {
    "code": "HOOKE",
    "name": "Hooke's Law",
    "category": "Mechanics",
    "description": "Force exerted by a spring is proportional to its extension.",
    "formula": "F = -kx"
  }
]
```

### POST `/history`
Request:
```json
{ "simulationCode": "HOOKE", "parameters": { "k": 20, "m": 2, "x0": 0.5 } }
```
Response:
```json
{
  "id": 15,
  "simulationCode": "HOOKE",
  "parameters": { "k": 20, "m": 2, "x0": 0.5 },
  "viewedAt": "2026-11-14T10:30:00"
}
```

## Error format (same everywhere)

```json
{ "status": 409, "error": "Conflict", "message": "Email already registered" }
```

| Code | Meaning |
|---|---|
| 400 | Bad or missing input |
| 401 | Not logged in, or bad or expired token |
| 404 | Not found |
| 409 | Duplicate (email already registered) |

## Agreed rules

| Topic | Rule |
|---|---|
| Token | Valid for 24 hours. On `401`, frontend clears it and goes to login |
| User identity | Always comes from the token. The frontend never sends a user ID |
| `simulationCode` | Uppercase and fixed, e.g. `HOOKE`, `PENDULUM`, `PROJECTILE`, `OHM`. Tell the backend when you claim a new one |
| `parameters` | Plain JSON object with numbers. Each simulation owner defines the keys (see below) |
| Dates | ISO 8601 |
| CORS | Backend allows `http://localhost:5173` |
| History saving | Save once when a simulation opens, or after ~2 seconds without slider changes. Not on every movement |
| Changes to this file | Via pull request, and tell the group first |

## Parameter keys per simulation (owners fill in)

| Code | Parameters | Owner |
|---|---|---|
| HOOKE | `k`, `m`, `x0` | |
| PENDULUM | `length`, `angle`, `g` | |
| PROJECTILE | | |
| OHM | | |

## Frontend simulation component contract

| Item | Rule |
|---|---|
| Props in | `initialParams` (object) |
| Callback out | `onParamsChange(params)`. The shared wrapper calls `POST /history`, the simulation never does |
| Simulation's job | Only draw and animate |
| Wrapper's job | Title, formula, layout, history saving |