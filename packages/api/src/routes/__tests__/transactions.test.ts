import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { transactionsRoute } from "../transactions";

// Mock db
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockReturnValue({
    returning: vi.fn().mockResolvedValue([
      {
        id: "test-uuid",
        userId: "00000000-0000-0000-0000-000000000000",
        pillar: "wants",
        amount: 45000,
        label: "Coffee",
        rawInput: "bought coffee 45k",
        type: "expense",
        transactionDate: "2026-03-02",
        createdAt: new Date().toISOString(),
      },
    ]),
  }),
});

const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      orderBy: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          offset: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  }),
});

vi.mock("../../db", () => ({
  db: {
    insert: () => mockInsert(),
    select: () => mockSelect(),
  },
}));

describe("transactions routes", () => {
  const app = new Hono().route("/api", transactionsRoute);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/transactions", () => {
    it("creates a transaction", async () => {
      const res = await app.request("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: "Coffee",
          amount: 45000,
          pillar: "wants",
          type: "expense",
          transactionDate: "2026-03-02",
          rawInput: "bought coffee 45k",
        }),
      });
      expect(res.status).toBe(201);
    });

    it("returns 400 for missing required fields", async () => {
      const res = await app.request("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: "Coffee" }),
      });
      expect(res.status).toBe(400);
    });
  });
});
