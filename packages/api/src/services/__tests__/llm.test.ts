import { describe, it, expect, vi, beforeEach } from "vitest";
import { llmParse } from "../llm";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("llmParse", () => {
  beforeEach(() => {
    vi.stubEnv("GROQ_API_KEY", "test-key");
    mockFetch.mockReset();
  });

  it("returns parsed transaction from LLM response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                intent: "transaction",
                label: "Coffee",
                amount: 45000,
                pillar: "wants",
                category: "Coffee & Drinks",
                date: "2026-03-02",
                type: "expense",
              }),
            },
          },
        ],
      }),
    });

    const result = await llmParse("bought coffee 45k");
    expect(result.intent).toBe("transaction");
    expect(result.transaction?.amount).toBe(45000);
    expect(result.transaction?.pillar).toBe("wants");
  });

  it("returns query response from LLM", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                intent: "query",
                answer: "Total expenses this month: Rp 500.000",
              }),
            },
          },
        ],
      }),
    });

    const result = await llmParse("total expenses this month");
    expect(result.intent).toBe("query");
    expect(result.query?.answer).toContain("500.000");
  });

  it("throws on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(llmParse("coffee 45k")).rejects.toThrow();
  });

  it("throws when no API key is set", async () => {
    vi.stubEnv("GROQ_API_KEY", "");
    await expect(llmParse("coffee 45k")).rejects.toThrow();
  });
});
