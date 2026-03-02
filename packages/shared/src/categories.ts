export const PILLARS = ["needs", "wants", "culture", "unexpected"] as const;
export type Pillar = (typeof PILLARS)[number];

export interface Category {
  name: string;
  pillar: Pillar;
  icon: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  // Needs
  { name: "Food & Groceries", pillar: "needs", icon: "🍚" },
  { name: "Transport", pillar: "needs", icon: "🚌" },
  { name: "Bills & Utilities", pillar: "needs", icon: "💡" },
  { name: "Health", pillar: "needs", icon: "🏥" },
  // Wants
  { name: "Dining Out", pillar: "wants", icon: "🍽️" },
  { name: "Shopping", pillar: "wants", icon: "🛍️" },
  { name: "Entertainment", pillar: "wants", icon: "🎮" },
  { name: "Coffee & Drinks", pillar: "wants", icon: "☕" },
  // Culture
  { name: "Books", pillar: "culture", icon: "📚" },
  { name: "Courses", pillar: "culture", icon: "🎓" },
  { name: "Hobbies", pillar: "culture", icon: "🎨" },
  { name: "Music", pillar: "culture", icon: "🎵" },
  // Unexpected
  { name: "Medical", pillar: "unexpected", icon: "💊" },
  { name: "Repairs", pillar: "unexpected", icon: "🔧" },
  { name: "Emergency", pillar: "unexpected", icon: "🚨" },
];
