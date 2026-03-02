import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionItem } from "../TransactionItem";
import type { Transaction } from "@kakeibo/shared";

const tx: Transaction = {
  id: "1",
  userId: "00000000-0000-0000-0000-000000000000",
  categoryId: null,
  pillar: "wants",
  amount: 45000,
  label: "Coffee",
  rawInput: "bought coffee 45k",
  type: "expense",
  transactionDate: "2026-03-02",
  createdAt: "2026-03-02T10:00:00Z",
};

describe("TransactionItem", () => {
  it("renders label and amount", () => {
    render(<TransactionItem transaction={tx} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText(/45/)).toBeInTheDocument();
  });

  it("shows pillar badge", () => {
    render(<TransactionItem transaction={tx} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/wants/i)).toBeInTheDocument();
  });

  it("shows date", () => {
    render(<TransactionItem transaction={tx} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/2026-03-02/)).toBeInTheDocument();
  });

  it("shows income with positive styling", () => {
    const income: Transaction = { ...tx, type: "income", pillar: "needs", label: "Salary", amount: 5000000 };
    render(<TransactionItem transaction={income} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText(/5\.000\.000/)).toBeInTheDocument();
  });
});
