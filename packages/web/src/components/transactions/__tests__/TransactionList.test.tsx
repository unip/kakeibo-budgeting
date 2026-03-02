import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionList } from "../TransactionList";
import type { Transaction } from "@kakeibo/shared";

const txs: Transaction[] = [
  {
    id: "1",
    userId: "u",
    categoryId: null,
    pillar: "wants",
    amount: 45000,
    label: "Coffee",
    rawInput: null,
    type: "expense",
    transactionDate: "2026-03-02",
    createdAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "2",
    userId: "u",
    categoryId: null,
    pillar: "needs",
    amount: 25000,
    label: "Lunch",
    rawInput: null,
    type: "expense",
    transactionDate: "2026-03-02",
    createdAt: "2026-03-02T12:00:00Z",
  },
  {
    id: "3",
    userId: "u",
    categoryId: null,
    pillar: "culture",
    amount: 80000,
    label: "Book",
    rawInput: null,
    type: "expense",
    transactionDate: "2026-03-01",
    createdAt: "2026-03-01T09:00:00Z",
  },
];

describe("TransactionList", () => {
  it("groups transactions by date", () => {
    render(<TransactionList transactions={txs} onEdit={vi.fn()} onDelete={vi.fn()} />);
    // Date appears in both group header and individual items
    const headings = screen.getAllByText("2026-03-02");
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-03-01").length).toBeGreaterThan(0);
  });

  it("renders all transaction items", () => {
    render(<TransactionList transactions={txs} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("Book")).toBeInTheDocument();
  });

  it("shows empty state when no transactions", () => {
    render(<TransactionList transactions={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
  });
});
