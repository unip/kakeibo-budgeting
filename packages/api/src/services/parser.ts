import type { ParseResponse, Pillar } from "@kakeibo/shared";

const AMOUNT_REGEX = /(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta)?/i;

const QUERY_KEYWORDS = [
  "total",
  "how much",
  "summary",
  "berapa",
  "ringkasan",
  "pengeluaran",
  "pemasukan",
  "report",
  "laporan",
];

const INCOME_KEYWORDS = [
  "salary",
  "gaji",
  "income",
  "received",
  "terima",
  "bonus",
  "freelance",
];

const PILLAR_KEYWORDS: Record<string, Pillar> = {
  // Needs
  food: "needs",
  groceries: "needs",
  grocery: "needs",
  makan: "needs",
  makanan: "needs",
  lunch: "needs",
  dinner: "needs",
  breakfast: "needs",
  sarapan: "needs",
  transport: "needs",
  grab: "needs",
  gojek: "needs",
  taxi: "needs",
  bus: "needs",
  bensin: "needs",
  gas: "needs",
  fuel: "needs",
  bill: "needs",
  bills: "needs",
  listrik: "needs",
  electricity: "needs",
  water: "needs",
  air: "needs",
  internet: "needs",
  rent: "needs",
  sewa: "needs",
  // Wants
  coffee: "wants",
  kopi: "wants",
  cafe: "wants",
  shopping: "wants",
  belanja: "wants",
  movie: "wants",
  film: "wants",
  game: "wants",
  entertainment: "wants",
  hiburan: "wants",
  dining: "wants",
  restaurant: "wants",
  restoran: "wants",
  clothes: "wants",
  baju: "wants",
  // Culture
  book: "culture",
  books: "culture",
  buku: "culture",
  course: "culture",
  kursus: "culture",
  hobby: "culture",
  hobi: "culture",
  music: "culture",
  musik: "culture",
  art: "culture",
  seni: "culture",
  // Unexpected
  medical: "unexpected",
  obat: "unexpected",
  doctor: "unexpected",
  dokter: "unexpected",
  hospital: "unexpected",
  rumah_sakit: "unexpected",
  repair: "unexpected",
  repairs: "unexpected",
  perbaikan: "unexpected",
  emergency: "unexpected",
  darurat: "unexpected",
};

function parseAmount(text: string): { amount: number; match: string } | null {
  const match = text.match(AMOUNT_REGEX);
  if (!match) return null;

  let num = parseFloat(match[1].replace(",", "."));
  const suffix = match[2]?.toLowerCase();

  if (suffix === "k" || suffix === "rb" || suffix === "ribu") {
    num *= 1000;
  } else if (suffix === "jt" || suffix === "juta") {
    num *= 1000000;
  }

  return { amount: Math.round(num), match: match[0] };
}

function detectPillar(text: string): Pillar {
  const lower = text.toLowerCase();
  for (const [keyword, pillar] of Object.entries(PILLAR_KEYWORDS)) {
    if (lower.includes(keyword)) return pillar;
  }
  return "wants";
}

function detectDate(text: string): { date: string; cleaned: string } {
  const lower = text.toLowerCase();
  const today = new Date();

  if (lower.includes("yesterday") || lower.includes("kemarin")) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const cleaned = text
      .replace(/\b(yesterday|kemarin)\b/gi, "")
      .trim();
    return { date: yesterday.toISOString().split("T")[0], cleaned };
  }

  return { date: today.toISOString().split("T")[0], cleaned: text };
}

function isQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return QUERY_KEYWORDS.some((kw) => lower.includes(kw));
}

function isIncome(text: string): boolean {
  const lower = text.toLowerCase();
  return INCOME_KEYWORDS.some((kw) => lower.includes(kw));
}

export function ruleBasedParse(text: string): ParseResponse {
  if (isQuery(text)) {
    return {
      intent: "query",
      query: { answer: "" },
    };
  }

  const amountResult = parseAmount(text);
  const { date, cleaned } = detectDate(text);

  const label = (amountResult
    ? cleaned.replace(amountResult.match, "")
    : cleaned
  )
    .replace(/\s+/g, " ")
    .trim();

  return {
    intent: "transaction",
    transaction: {
      label: label || text,
      amount: amountResult?.amount ?? 0,
      pillar: detectPillar(text),
      category: "",
      date,
      type: isIncome(text) ? "income" : "expense",
      confidence: amountResult ? 0.6 : 0.3,
    },
  };
}
