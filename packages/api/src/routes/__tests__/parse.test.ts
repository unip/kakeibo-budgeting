import { describe, it, expect, vi } from "vitest";
import { Hono } from "hono";
import { parseRoute } from "../parse";

// Mock the parse service to avoid LLM calls
vi.mock("../../services/parse", () => ({
  parseInput: vi.fn(async (text: string) => {
    if (text.includes("total")) {
      return { intent: "query", query: { answer: "Total: Rp 500.000" } };
    }
    return {
      intent: "transaction",
      transaction: {
        label: "Coffee",
        amount: 45000,
        pillar: "wants",
        category: "Coffee & Drinks",
        date: "2026-03-02",
        type: "expense",
        confidence: 0.9,
      },
    };
  }),
}));

describe("POST /api/parse", () => {
  const app = new Hono().route("/api", parseRoute);

  it("returns parsed transaction", async () => {
    const res = await app.request("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "bought coffee 45k" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.intent).toBe("transaction");
    expect(body.transaction.amount).toBe(45000);
  });

  it("returns query answer", async () => {
    const res = await app.request("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "total expenses this month" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.intent).toBe("query");
    expect(body.query.answer).toContain("500.000");
  });

  it("returns 400 for empty text", async () => {
    const res = await app.request("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "" }),
    });
    expect(res.status).toBe(400);
  });
});
