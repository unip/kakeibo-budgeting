import type { Pillar } from "@kakeibo/shared";
import { Utensils, ShoppingBag, BookOpen, AlertCircle } from "lucide-react";

const PILLAR_GRADIENTS: Record<Pillar, string> = {
  needs: "from-blue-600 to-blue-400",
  wants: "from-purple-600 to-purple-400",
  culture: "from-amber-600 to-amber-400",
  unexpected: "from-pink-600 to-pink-400",
};

const PILLAR_ICONS: Record<Pillar, any> = {
  needs: Utensils,
  wants: ShoppingBag,
  culture: BookOpen,
  unexpected: AlertCircle,
};

interface PillarCardProps {
  pillar: Pillar;
  spent: number;
  budget: number | null;
}

export function PillarCard({ pillar, spent, budget }: PillarCardProps) {
  const pct = budget ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const isOver = budget !== null && spent > budget;
  const Icon = PILLAR_ICONS[pillar];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${PILLAR_GRADIENTS[pillar]} p-4 text-white`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 opacity-90" />
          <h3 className="text-sm font-medium capitalize opacity-90">{pillar}</h3>
        </div>
        {isOver && (
          <span className="rounded-full bg-red-500/30 px-2 py-0.5 text-xs font-medium">
            Over budget
          </span>
        )}
      </div>

      <div className="mt-2 text-2xl font-bold">
        Rp {spent.toLocaleString("id-ID")}
      </div>

      {budget !== null ? (
        <>
          <div className="mt-1 text-xs opacity-80">
            of Rp {budget.toLocaleString("id-ID")}
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all ${isOver ? "bg-red-400" : "bg-white/80"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      ) : (
        <div className="mt-1 text-xs opacity-60">No budget set</div>
      )}
    </div>
  );
}
