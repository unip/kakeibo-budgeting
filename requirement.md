# Kakeibo Budgeting App - Requirements

## Overview

A personal Kakeibo budgeting app with chat-based transaction input. Users type natural language (e.g., "bought coffee 45k") and the system parses it into structured data. Web-first, deployable on Coolify VPS with Docker Compose.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + Zustand + Recharts
- **Backend**: Node + Hono + Drizzle ORM
- **Database**: PostgreSQL 16
- **Auth**: Better Auth (email/password, session-based)
- **LLM**: Groq free tier (Llama 3.1 8B) + rule-based fallback
- **Monorepo**: pnpm workspaces
- **Deployment**: Docker Compose on Coolify VPS
- **Dev Tooling**: Use Context7 MCP for up-to-date documentation of all libraries during implementation
- **Testing**: TDD approach — write tests before implementation in every phase. Vitest for backend + frontend unit/integration tests.

## Project Structure

```
kakeibo-budgeting/
├── packages/
│   ├── web/                  # React frontend (Vite)
│   │   └── src/
│   │       ├── components/   # ui/, chat/, dashboard/, transactions/, layout/
│   │       ├── pages/        # Home, Dashboard, History, Settings
│   │       ├── stores/       # Zustand stores
│   │       └── lib/          # API client, utils
│   ├── api/                  # Hono backend
│   │   └── src/
│   │       ├── routes/       # transactions, parse, dashboard, auth
│   │       ├── services/     # parser (LLM + rule-based), llm client
│   │       ├── db/           # Drizzle schema, migrations
│   │       └── middleware/   # auth (optional)
│   └── shared/               # Shared types, category definitions
├── docker-compose.yml
├── Dockerfile
├── pnpm-workspace.yaml
└── .env.example
```

## Database Schema

**Tables**: `users`, `categories`, `transactions`, `monthly_budgets`

- `users` — default row for single-user mode, optional signup later
- `categories` — subcategories mapped to Kakeibo pillars (needs/wants/culture/unexpected)
- `transactions` — amount (BIGINT, smallest currency unit), label, pillar, raw_input, type (expense/income), date
- `monthly_budgets` — per-pillar budget targets per month

## API Endpoints

| Method     | Path                     | Purpose                                                            |
| ---------- | ------------------------ | ------------------------------------------------------------------ |
| POST       | `/api/parse`             | Parse chat text into structured transaction preview                |
| POST       | `/api/transactions`      | Save confirmed transaction                                         |
| GET        | `/api/transactions`      | List with filters (month, pillar, search, page)                    |
| PUT/DELETE | `/api/transactions/:id`  | Edit/delete                                                        |
| GET        | `/api/dashboard/summary` | Totals per pillar, budget vs actual                                |
| GET        | `/api/dashboard/trend`   | Monthly spending over time                                         |
| GET/POST   | `/api/categories`        | Manage subcategories                                               |
| GET/PUT    | `/api/budgets/:month`    | Monthly budget goals                                               |
| ALL        | `/api/auth/**`           | Better Auth handles all auth routes (signup, login, session, etc.) |

## Chat Parsing

The chat input handles two intents:

1. **Transaction input**: "bought coffee 45k" → parsed into structured transaction for confirmation
2. **Query**: "total expenses this month", "how much did I spend on wants?" → returns a summary answer in the chat

**Intent detection**: The LLM (or rule-based fallback) first classifies the input as `transaction` or `query`. For queries, the backend fetches relevant data from the database and returns a natural language summary.

**Primary**: Groq API (free: 30 req/min, 14.4k req/day) with Llama 3.1 8B, `temperature: 0`, JSON mode. System prompt extracts intent + structured data.

**Fallback**: Rule-based regex parser for amount patterns (45k, 2jt), keyword-to-pillar mapping, date keywords (yesterday/kemarin). Query fallback matches keywords like "total", "how much", "summary".

**Flow**:

- **Transaction**: User types → POST `/api/parse` → preview bubble → user confirms → POST `/api/transactions`
- **Query**: User types → POST `/api/parse` → backend queries DB → returns summary answer as chat bubble

## Frontend Pages

- **HomePage**: Chat input at bottom, recent transactions as chat bubbles. Primary interaction surface.
- **DashboardPage**: 4 pillar cards with progress bars, donut chart, monthly trend.
- **HistoryPage**: Filterable transaction list grouped by date.
- **SettingsPage**: Budget goals, categories, optional auth.

## UI Design

- Dark mode default
- Gradient per pillar: blue (needs), purple (wants), amber (culture), pink (unexpected)
- Bottom nav on mobile, sidebar on desktop
- Sleek, modern, minimal — not overwhelming
- **i18n**: Support English and Bahasa Indonesia. User can switch language in settings. Chat input accepts both languages naturally.

## Auth Model (Better Auth)

- Uses Better Auth library with Hono integration and Drizzle adapter
- Email/password authentication with session-based auth
- Works as single-user without signup (default user row)
- Optional signup to sync data across devices
- Better Auth manages its own tables (user, session, account, verification)
- Frontend uses Better Auth React client for login/signup/session management

## Docker Compose (Coolify)

- `app` service: multi-stage Node build, serves API + static frontend on port 3000
- `db` service: postgres:16-alpine with health check and persistent volume
- Environment vars: `DATABASE_URL`, `GROQ_API_KEY`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

## Implementation Phases

### Phase 1: Project Skeleton

- Init pnpm monorepo, Hono API, Vite+React+Tailwind
- Drizzle schema + migrations, Docker Compose
- Seed default user and categories

### Phase 2: Core Chat Flow

- Rule-based parser then Groq LLM parser
- `/api/parse` + `/api/transactions` endpoints
- ChatInput, ChatBubble components, HomePage end-to-end

### Phase 3: Transaction Management

- GET/PUT/DELETE transactions with filters
- HistoryPage with FilterBar

### Phase 4: Dashboard

- Summary/trend endpoints, PillarCards, Recharts charts
- Monthly budget setting

### Phase 5: Polish & Deploy

- Responsive layout, dark mode, gradients
- Deploy to Coolify, PWA manifest

### Phase 6: Auth with Better Auth

- Set up Better Auth with Hono plugin and Drizzle adapter
- Email/password signup/login, session management
- Auth middleware on protected API routes
- Frontend login/signup pages using Better Auth React client
