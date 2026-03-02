import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { transactionsRoute } from "../transactions";

const sampleRow = {
  id: "test-uuid",
  userId: "00000000-0000-0000-0000-000000000000",
  pillar: "wants",
  amount: 45000,
  label: "Coffee",
  rawInput: "bought coffee 45k",
  type: "expense",
  transactionDate: "2026-03-02",
  createdAt: new Date().toISOString(),
};

const mockReturning = vi.fn().mockResolvedValue([sampleRow]);
const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
const mockInsert = vi.fn().mockReturnValue({ values: mockValues });

const mockOffset = vi.fn().mockResolvedValue([sampleRow]);
const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

const mockUpdateReturning = vi.fn().mockResolvedValue([{ ...sampleRow, label: "Updated" }]);
const mockUpdateWhere = vi.fn().mockReturnValue({ returning: mockUpdateReturning });
const mockSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });

const mockDeleteReturning = vi.fn().mockResolvedValue([sampleRow]);
const mockDeleteWhere = vi.fn().mockReturnValue({ returning: mockDeleteReturning });
const mockDelete = vi.fn().mockReturnValue({ where: mockDeleteWhere });

vi.mock("../../db", () => ({
  db: {
    insert: (...args: unknown[]) => mockInsert(...args),
    select: (...args: unknown[]) => mockSelect(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

describe("transactions routes", () => {
  const app = new Hono().route("/api", transactionsRoute);

  beforeEach(() => {
    vi.clearAllMocks();
    mockReturning.mockResolvedValue([sampleRow]);
    mockOffset.mockResolvedValue([sampleRow]);
    mockUpdateReturning.mockResolvedValue([{ ...sampleRow, label: "Updated" }]);
    mockDeleteReturning.mockResolvedValue([sampleRow]);
  });

  describe("POST /api/transactions", () => {
    it("creates a transaction and returns 201", async () => {
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
      const body = await res.json();
      expect(body.label).toBe("Coffee");
      expect(body.amount).toBe(45000);
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

  describe("GET /api/transactions", () => {
    it("returns a list of transactions", async () => {
      const res = await app.request("/api/transactions");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
    });

    it("passes filter params through", async () => {
      const res = await app.request(
        "/api/transactions?month=2026-03&pillar=wants&search=coffee&page=2"
      );
      expect(res.status).toBe(200);
    });

    it("returns empty array when no transactions", async () => {
      mockOffset.mockResolvedValueOnce([]);
      const res = await app.request("/api/transactions");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual([]);
    });
  });

  describe("PUT /api/transactions/:id", () => {
    it("updates a transaction", async () => {
      const res = await app.request("/api/transactions/test-uuid", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: "Updated" }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.label).toBe("Updated");
    });

    it("returns 404 when transaction not found", async () => {
      mockUpdateReturning.mockResolvedValueOnce([]);
      const res = await app.request("/api/transactions/nonexistent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: "Updated" }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/transactions/:id", () => {
    it("deletes a transaction", async () => {
      const res = await app.request("/api/transactions/test-uuid", {
        method: "DELETE",
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.deleted).toBe(true);
    });

    it("returns 404 when transaction not found", async () => {
      mockDeleteReturning.mockResolvedValueOnce([]);
      const res = await app.request("/api/transactions/nonexistent", {
        method: "DELETE",
      });
      expect(res.status).toBe(404);
    });
  });
});
