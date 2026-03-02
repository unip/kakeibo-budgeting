import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatBubble } from "../ChatBubble";
import type { ChatMessage } from "../../../stores/chat";

const userMsg: ChatMessage = {
  id: "1",
  role: "user",
  text: "bought coffee 45k",
  timestamp: Date.now(),
};

const transactionMsg: ChatMessage = {
  id: "2",
  role: "assistant",
  text: "Coffee — Rp 45.000",
  parseResult: {
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
  },
  timestamp: Date.now(),
};

const queryMsg: ChatMessage = {
  id: "3",
  role: "assistant",
  text: "Total expenses this month: Rp 500.000",
  parseResult: {
    intent: "query",
    query: { answer: "Total expenses this month: Rp 500.000" },
  },
  timestamp: Date.now(),
};

describe("ChatBubble", () => {
  it("renders user message aligned right", () => {
    render(<ChatBubble message={userMsg} onConfirm={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.getByText("bought coffee 45k")).toBeInTheDocument();
  });

  it("renders transaction preview with confirm/dismiss buttons", () => {
    render(<ChatBubble message={transactionMsg} onConfirm={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.getAllByText(/Coffee/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/45/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
  });

  it("calls onConfirm when confirm clicked", () => {
    const onConfirm = vi.fn();
    render(<ChatBubble message={transactionMsg} onConfirm={onConfirm} onDismiss={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledWith("2");
  });

  it("renders query answer without confirm buttons", () => {
    render(<ChatBubble message={queryMsg} onConfirm={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.getByText(/500\.000/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
  });

  it("shows confirmed state", () => {
    const confirmed = { ...transactionMsg, confirmed: true };
    render(<ChatBubble message={confirmed} onConfirm={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
  });
});
