import type { Pillar } from "./categories";

export type TransactionType = "expense" | "income";

export interface ParsedTransaction {
  label: string;
  amount: number;
  pillar: Pillar;
  category: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  confidence: number;
}

export interface ParseQueryResult {
  answer: string;
}

export type ParseIntent = "transaction" | "query";

export interface ParseResponse {
  intent: ParseIntent;
  transaction?: ParsedTransaction;
  query?: ParseQueryResult;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: number | null;
  pillar: Pillar;
  amount: number;
  label: string;
  rawInput: string | null;
  type: TransactionType;
  transactionDate: string;
  createdAt: string;
}

export interface MonthlyBudget {
  id: number;
  userId: string;
  month: string;
  needsBudget: number | null;
  wantsBudget: number | null;
  cultureBudget: number | null;
  unexpectedBudget: number | null;
  income: number | null;
}

export interface DashboardSummary {
  month: string;
  pillars: Record<
    Pillar,
    {
      spent: number;
      budget: number | null;
    }
  >;
  totalSpent: number;
  totalIncome: number;
}
