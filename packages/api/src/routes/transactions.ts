import { Hono } from "hono";
import { db } from "../db";
import { transactions } from "../db/schema";
import { eq, desc, and, sql, like, between } from "drizzle-orm";
import type { Pillar } from "@kakeibo/shared";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export const transactionsRoute = new Hono();

transactionsRoute.post("/transactions", async (c) => {
  const body = await c.req.json();
  const { label, amount, pillar, type, transactionDate, rawInput, categoryId } =
    body;

  if (!label || !amount || !pillar || !type) {
    return c.json({ error: "label, amount, pillar, and type are required" }, 400);
  }

  const [row] = await db
    .insert(transactions)
    .values({
      userId: DEFAULT_USER_ID,
      label,
      amount,
      pillar: pillar as Pillar,
      type,
      transactionDate: transactionDate || new Date().toISOString().split("T")[0],
      rawInput: rawInput || null,
      categoryId: categoryId || null,
    })
    .returning();

  return c.json(row, 201);
});

transactionsRoute.get("/transactions", async (c) => {
  const month = c.req.query("month");
  const pillar = c.req.query("pillar");
  const search = c.req.query("search");
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = (page - 1) * limit;

  const conditions = [eq(transactions.userId, DEFAULT_USER_ID)];

  if (month) {
    const start = `${month}-01`;
    const end = `${month}-31`;
    conditions.push(between(transactions.transactionDate, start, end));
  }

  if (pillar) {
    conditions.push(eq(transactions.pillar, pillar as Pillar));
  }

  if (search) {
    conditions.push(like(transactions.label, `%${search}%`));
  }

  const rows = await db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.transactionDate))
    .limit(limit)
    .offset(offset);

  return c.json(rows);
});

transactionsRoute.put("/transactions/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const [row] = await db
    .update(transactions)
    .set(body)
    .where(and(eq(transactions.id, id), eq(transactions.userId, DEFAULT_USER_ID)))
    .returning();

  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

transactionsRoute.delete("/transactions/:id", async (c) => {
  const id = c.req.param("id");

  const [row] = await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, DEFAULT_USER_ID)))
    .returning();

  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ deleted: true });
});
