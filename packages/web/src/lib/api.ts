import type { ParseResponse, Transaction } from "@kakeibo/shared";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  parse(text: string) {
    return request<ParseResponse>("/parse", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  createTransaction(data: {
    label: string;
    amount: number;
    pillar: string;
    type: string;
    transactionDate: string;
    rawInput?: string;
    categoryId?: number;
  }) {
    return request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getTransactions(params?: {
    month?: string;
    pillar?: string;
    search?: string;
    page?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.month) query.set("month", params.month);
    if (params?.pillar) query.set("pillar", params.pillar);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    const qs = query.toString();
    return request<Transaction[]>(`/transactions${qs ? `?${qs}` : ""}`);
  },

  updateTransaction(id: string, data: Partial<Transaction>) {
    return request<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteTransaction(id: string) {
    return request<{ deleted: boolean }>(`/transactions/${id}`, {
      method: "DELETE",
    });
  },
};
