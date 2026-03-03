import { PILLARS } from "@kakeibo/shared";
import { Utensils, ShoppingBag, BookOpen, AlertCircle } from "lucide-react";

interface FilterBarProps {
  month: string;
  pillar: string;
  search: string;
  onMonthChange: (month: string) => void;
  onPillarChange: (pillar: string) => void;
  onSearchChange: (search: string) => void;
}

const PILLAR_LABELS: Record<string, string> = {
  needs: "Needs",
  wants: "Wants",
  culture: "Culture",
  unexpected: "Unexpected",
};

const PILLAR_ICONS: Record<string, any> = {
  needs: Utensils,
  wants: ShoppingBag,
  culture: BookOpen,
  unexpected: AlertCircle,
};

export function FilterBar({
  month,
  pillar,
  search,
  onMonthChange,
  onPillarChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transactions..."
          className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex gap-2">
        {PILLARS.map((p) => {
          const Icon = PILLAR_ICONS[p];
          return (
            <button
              key={p}
              onClick={() => onPillarChange(pillar === p ? "" : p)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                pillar === p
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <Icon className="h-3 w-3" />
              {PILLAR_LABELS[p]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
