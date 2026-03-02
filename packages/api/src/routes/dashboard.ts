import { Hono } from "hono";
import { db } from "../db";
import { transactions, monthlyBudgets } from "../db/schema";
import { eq, and, between, sql } from "drizzle-orm";
import type { Pillar } from "@kakeibo/shared";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
const PILLARS: Pillar[] = ["needs", "wants", "culture", "unexpected"];

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const dashboardRoute = new Hono();

dashboardRoute.get("/dashboard/summary", async (c) => {
  const month = c.req.query("month") || currentMonth();
  const start = `${month}-01`;
  const end = `${month}-31`;

  // Get spending per pillar
  const pillarTotals = await db
    .select({
      pillar: transactions.pillar,
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)::int`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, DEFAULT_USER_ID),
        eq(transactions.type, "expense"),
        between(transactions.transactionDate, start, end)
      )
    )
    .groupBy(transactions.pillar)
    .execute();

  // Get total income
  const incomeResult = await db
    .select({
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)::int`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, DEFAULT_USER_ID),
        eq(transactions.type, "income"),
        between(transactions.transactionDate, start, end)
      )
    )
    .execute();

  // Get budget
  const budgetRows = await db
    .select()
    .from(monthlyBudgets)
    .where(
      and(
        eq(monthlyBudgets.userId, DEFAULT_USER_ID),
        eq(monthlyBudgets.month, start)
      )
    );

  const budget = budgetRows[0] || null;
  const pillarMap = Object.fromEntries(pillarTotals.map((r) => [r.pillar, r.total]));

  const pillars = Object.fromEntries(
    PILLARS.map((p) => [
      p,
      {
        spent: pillarMap[p] || 0,
        budget: budget ? (budget[`${p}Budget` as keyof typeof budget] as number | null) : null,
      },
    ])
  );

  const totalSpent = PILLARS.reduce((sum, p) => sum + (pillarMap[p] || 0), 0);
  const totalIncome = incomeResult[0]?.total || 0;

  return c.json({ month, pillars, totalSpent, totalIncome });
});

dashboardRoute.get("/dashboard/trend", async (c) => {
  const months = parseInt(c.req.query("months") || "6");
  const d = new Date();
  d.setMonth(d.getMonth() - months + 1);
  const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

  const rows = await db
    .select({
      month: sql<string>`TO_CHAR(${transactions.transactionDate}::date, 'YYYY-MM')`,
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)::int`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, DEFAULT_USER_ID),
        eq(transactions.type, "expense"),
        sql`${transactions.transactionDate} >= ${start}`
      )
    )
    .groupBy(sql`TO_CHAR(${transactions.transactionDate}::date, 'YYYY-MM')`)
    .execute();

  return c.json(rows);
});

dashboardRoute.get("/budgets/:month", async (c) => {
  const month = c.req.param("month");
  const monthDate = `${month}-01`;

  const rows = await db
    .select()
    .from(monthlyBudgets)
    .where(
      and(
        eq(monthlyBudgets.userId, DEFAULT_USER_ID),
        eq(monthlyBudgets.month, monthDate)
      )
    );

  if (rows.length === 0) {
    return c.json({
      month,
      needsBudget: null,
      wantsBudget: null,
      cultureBudget: null,
      unexpectedBudget: null,
      income: null,
    });
  }

  return c.json(rows[0]);
});

dashboardRoute.put("/budgets/:month", async (c) => {
  const month = c.req.param("month");
  const monthDate = `${month}-01`;
  const body = await c.req.json();

  const [row] = await db
    .insert(monthlyBudgets)
    .values({
      userId: DEFAULT_USER_ID,
      month: monthDate,
      ...body,
    })
    .onConflictDoUpdate({
      target: [monthlyBudgets.userId, monthlyBudgets.month],
      set: body,
    })
    .returning();

  return c.json(row);
});
