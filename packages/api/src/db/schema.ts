import {
  pgTable,
  uuid,
  text,
  serial,
  integer,
  bigint,
  date,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    name: text("name").notNull(),
    pillar: text("pillar", {
      enum: ["needs", "wants", "culture", "unexpected"],
    }).notNull(),
    icon: text("icon"),
  },
  (t) => [uniqueIndex("uq_categories_user_name").on(t.userId, t.name)]
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    categoryId: integer("category_id").references(() => categories.id),
    pillar: text("pillar", {
      enum: ["needs", "wants", "culture", "unexpected"],
    }).notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    label: text("label").notNull(),
    rawInput: text("raw_input"),
    type: text("type", { enum: ["expense", "income"] })
      .notNull()
      .default("expense"),
    transactionDate: date("transaction_date").notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("idx_transactions_user_date").on(t.userId, t.transactionDate),
    index("idx_transactions_pillar").on(t.userId, t.pillar),
  ]
);

export const monthlyBudgets = pgTable(
  "monthly_budgets",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    month: date("month").notNull(),
    needsBudget: bigint("needs_budget", { mode: "number" }),
    wantsBudget: bigint("wants_budget", { mode: "number" }),
    cultureBudget: bigint("culture_budget", { mode: "number" }),
    unexpectedBudget: bigint("unexpected_budget", { mode: "number" }),
    income: bigint("income", { mode: "number" }),
  },
  (t) => [uniqueIndex("uq_budgets_user_month").on(t.userId, t.month)]
);
