import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { dashboardRoute } from "../dashboard";

// Chainable proxy mock — any chain of method calls resolves to `value`
function chainMock(value: unknown = []) {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === "then") {
        return (resolve: (v: unknown) => void) => resolve(value);
      }
      return (..._args: unknown[]) => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler) as any;
}

const budgetData = {
  id: 1,
  needsBudget: 2000000,
  wantsBudget: 1000000,
  cultureBudget: 500000,
  unexpectedBudget: 300000,
  income: 5000000,
};

vi.mock("../../db", () => ({
  db: {
    select: () => chainMock([{ pillar: "needs", total: 150000 }]),
    insert: () => chainMock([budgetData]),
  },
}));

describe("dashboard routes", () => {
  const app = new Hono().route("/api", dashboardRoute);

  describe("GET /api/dashboard/summary", () => {
    it("returns 200 with summary shape", async () => {
      const res = await app.request("/api/dashboard/summary?month=2026-03");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("pillars");
      expect(body).toHaveProperty("totalSpent");
      expect(body).toHaveProperty("totalIncome");
      expect(body.month).toBe("2026-03");
    });
  });

  describe("GET /api/dashboard/trend", () => {
    it("returns 200 with array", async () => {
      const res = await app.request("/api/dashboard/trend?months=6");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
    });
  });

  describe("GET /api/budgets/:month", () => {
    it("returns 200 with budget shape", async () => {
      const res = await app.request("/api/budgets/2026-03");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/budgets/:month", () => {
    it("returns 200 on upsert", async () => {
      const res = await app.request("/api/budgets/2026-03", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ needsBudget: 2000000 }),
      });
      expect(res.status).toBe(200);
    });
  });
});
