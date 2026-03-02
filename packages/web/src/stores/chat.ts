import { create } from "zustand";
import type { ParseResponse } from "@kakeibo/shared";
import { api } from "../lib/api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  parseResult?: ParseResponse;
  confirmed?: boolean;
  timestamp: number;
}

interface ChatStore {
  messages: ChatMessage[];
  loading: boolean;
  send: (text: string) => Promise<void>;
  confirm: (messageId: string) => Promise<void>;
  dismiss: (messageId: string) => void;
}

let nextId = 0;
const genId = () => `msg-${++nextId}-${Date.now()}`;

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,

  async send(text: string) {
    const userMsg: ChatMessage = {
      id: genId(),
      role: "user",
      text,
      timestamp: Date.now(),
    };

    set((s) => ({ messages: [...s.messages, userMsg], loading: true }));

    try {
      const result = await api.parse(text);

      const assistantMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        text:
          result.intent === "query"
            ? result.query?.answer || ""
            : `${result.transaction?.label} — Rp ${result.transaction?.amount?.toLocaleString("id-ID")}`,
        parseResult: result,
        timestamp: Date.now(),
      };

      set((s) => ({ messages: [...s.messages, assistantMsg], loading: false }));
    } catch {
      const errMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        text: "Sorry, I couldn't parse that. Please try again.",
        timestamp: Date.now(),
      };
      set((s) => ({ messages: [...s.messages, errMsg], loading: false }));
    }
  },

  async confirm(messageId: string) {
    const msg = get().messages.find((m) => m.id === messageId);
    if (!msg?.parseResult?.transaction) return;

    const t = msg.parseResult.transaction;
    await api.createTransaction({
      label: t.label,
      amount: t.amount,
      pillar: t.pillar,
      type: t.type,
      transactionDate: t.date,
      rawInput: get().messages.find(
        (m) =>
          m.role === "user" &&
          m.timestamp < msg.timestamp
      )?.text,
    });

    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === messageId ? { ...m, confirmed: true } : m
      ),
    }));
  },

  dismiss(messageId: string) {
    set((s) => ({
      messages: s.messages.filter((m) => m.id !== messageId),
    }));
  },
}));
