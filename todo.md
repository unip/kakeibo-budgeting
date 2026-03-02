# Kakeibo Budgeting - Implementation Checklist

> **TDD approach**: In every phase, write tests first, then implement to make them pass.

## Phase 1: Project Skeleton

- [ ] Init pnpm workspace (`pnpm-workspace.yaml`, root `package.json`)
- [ ] Set up `packages/shared` with types and category constants
- [ ] Set up `packages/api` with Hono, TypeScript, dev scripts
- [ ] Set up `packages/web` with Vite, React, TailwindCSS, TypeScript
- [ ] Set up Vitest for `packages/api` and `packages/web`
- [ ] Configure Drizzle ORM with PostgreSQL connection (`packages/api/src/db/index.ts`)
- [ ] Define database schema (`packages/api/src/db/schema.ts`)
  - [ ] `users` table (default single-user row)
  - [ ] `categories` table (pillar mapping)
  - [ ] `transactions` table
  - [ ] `monthly_budgets` table
- [ ] Create initial migration
- [ ] Seed default user and default Kakeibo categories
- [ ] Create `docker-compose.yml` (app + postgres)
- [ ] Create multi-stage `Dockerfile`
- [ ] Create `.env.example`
- [ ] Verify: `docker compose up` starts app and runs migrations

## Phase 2: Core Chat Flow

### Backend

- [ ] **Tests first**: rule-based parser tests (amount extraction, pillar mapping, date parsing, income detection)
- [ ] Implement rule-based parser (`packages/api/src/services/parser.ts`)
  - [ ] Amount extraction (45k, 2jt, plain numbers)
  - [ ] Keyword-to-pillar mapping
  - [ ] Date keyword parsing (yesterday, kemarin)
  - [ ] Income vs expense detection
- [ ] **Tests first**: intent detection tests (transaction vs query classification)
- [ ] Implement intent detection (transaction vs query)
  - [ ] Rule-based: keywords like "total", "how much", "summary", "berapa", "ringkasan" → query intent
  - [ ] LLM: classify intent in system prompt
- [ ] **Tests first**: LLM parser tests (mock Groq API, test fallback behavior)
- [ ] Implement Groq LLM parser (`packages/api/src/services/llm.ts`)
  - [ ] System prompt for intent detection + structured extraction
  - [ ] JSON mode with Llama 3.1 8B
  - [ ] Fallback to rule-based on failure
- [ ] **Tests first**: query handler tests (aggregation queries, summary output)
- [ ] Implement query handler (`packages/api/src/services/query.ts`)
  - [ ] Fetch aggregated data from DB based on parsed query (e.g., totals by pillar, month)
  - [ ] Return natural language summary as chat response
- [ ] **Tests first**: route tests for `/api/parse`, `/api/transactions`
- [ ] `POST /api/parse` route — returns structured preview (transaction) or summary answer (query)
- [ ] `POST /api/transactions` route — save confirmed transaction
- [ ] `GET /api/transactions` route — list with basic pagination

### Frontend

- [ ] Set up API client (`packages/web/src/lib/api.ts`)
- [ ] Create Zustand transaction store
- [ ] **Tests first**: ChatInput and ChatBubble component tests
- [ ] Build `ChatInput` component (text input + send button)
- [ ] Build `ChatBubble` component (user message + parsed preview card)
  - [ ] Confirm / edit / cancel actions on preview
  - [ ] Query answer bubble (summary display)
- [ ] Build `HomePage` — chat input at bottom, bubbles above
- [ ] Wire up end-to-end: type → parse → preview → confirm → saved

## Phase 3: Transaction Management

### Backend

- [ ] **Tests first**: transaction CRUD route tests (filters, edit, delete)
- [ ] `GET /api/transactions` — add filters (month, pillar, search)
- [ ] `PUT /api/transactions/:id` — edit transaction
- [ ] `DELETE /api/transactions/:id` — delete transaction

### Frontend

- [ ] **Tests first**: TransactionItem, TransactionList, FilterBar component tests
- [ ] Build `TransactionItem` component (icon, label, amount, pillar badge, date)
- [ ] Build `TransactionList` component (grouped by date)
- [ ] Build `FilterBar` component (month picker, pillar chips, search)
- [ ] Build `HistoryPage` — full transaction list with filters
- [ ] Edit transaction modal/flow
- [ ] Delete transaction with confirmation

## Phase 4: Dashboard

### Backend

- [ ] **Tests first**: dashboard endpoint tests (summary aggregation, trend data, budget CRUD)
- [ ] `GET /api/dashboard/summary` — totals per pillar, budget vs actual
- [ ] `GET /api/dashboard/trend` — monthly spending over time
- [ ] `GET /api/budgets/:month` — get monthly budget
- [ ] `PUT /api/budgets/:month` — set monthly budget

### Frontend

- [ ] **Tests first**: PillarCard, chart component tests
- [ ] Build `PillarCard` component (spent vs budget, progress bar, gradient)
- [ ] Build spending donut chart (Recharts)
- [ ] Build monthly trend bar chart (Recharts)
- [ ] Build `DashboardPage` — 4 pillar cards + charts
- [ ] Build budget setting UI in `SettingsPage`

## Phase 5: Polish & Deploy

### UI/UX

- [ ] Responsive `AppShell` layout (sidebar desktop, bottom nav mobile)
- [ ] `BottomNav` component (Home, Dashboard, History, Settings)
- [ ] Dark mode default with TailwindCSS
- [ ] Pillar gradient themes (blue/purple/amber/pink)
- [ ] Loading states and error handling
- [ ] Empty states for no transactions / no budget set
- [ ] i18n setup (English + Bahasa Indonesia)
  - [ ] Translation files (`en.json`, `id.json`) for all UI strings
  - [ ] Language switcher in Settings
  - [ ] Store language preference (localStorage)
  - [ ] LLM/parser already handles both languages in chat input

### Deployment

- [ ] Hono serves static frontend files in production
- [ ] PWA manifest + service worker for mobile install
- [ ] Test full Docker Compose build
- [ ] Deploy to Coolify VPS
- [ ] Set environment variables in Coolify dashboard

## Phase 6: Auth with Better Auth

### Backend

- [ ] **Tests first**: auth flow tests (register, login, session, protected routes)
- [ ] Install and configure Better Auth with Hono plugin
- [ ] Set up Drizzle adapter for Better Auth tables (user, session, account, verification)
- [ ] Generate Better Auth migrations
- [ ] Mount Better Auth handler on `/api/auth/**`
- [ ] Add auth middleware to protected routes (transactions, budgets, dashboard)
- [ ] Associate transactions/budgets with authenticated user

### Frontend

- [ ] **Tests first**: auth page and session logic tests
- [ ] Install Better Auth React client
- [ ] Create auth client instance (`packages/web/src/lib/auth.ts`)
- [ ] Build login page
- [ ] Build signup page
- [ ] Add session check / redirect logic
- [ ] Auth state in Zustand or Better Auth hooks
- [ ] Settings page: account info, logout
