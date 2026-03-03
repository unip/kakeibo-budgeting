import type { Transaction } from "@kakeibo/shared";
import { Pencil, Trash2, Utensils, ShoppingBag, BookOpen, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

const PILLAR_BADGE: Record<string, string> = {
  needs: "bg-blue-600/20 text-blue-400",
  wants: "bg-purple-600/20 text-purple-400",
  culture: "bg-amber-600/20 text-amber-400",
  unexpected: "bg-pink-600/20 text-pink-400",
};

const PILLAR_ICONS: Record<string, any> = {
  needs: Utensils,
  wants: ShoppingBag,
  culture: BookOpen,
  unexpected: AlertCircle,
};

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({
  transaction: tx,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = tx.type === "income";
  const PillarIcon = PILLAR_ICONS[tx.pillar] || TrendingDown;

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`p-2 rounded-lg ${PILLAR_BADGE[tx.pillar] || "bg-gray-700 text-gray-300"}`}>
          <PillarIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{tx.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs capitalize ${PILLAR_BADGE[tx.pillar] || "bg-gray-700 text-gray-300"}`}
            >
              {tx.pillar}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{tx.transactionDate}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`font-bold flex items-center gap-1 ${isIncome ? "text-green-400" : "text-white"}`}
        >
          {isIncome ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          Rp {tx.amount.toLocaleString("id-ID")}
        </span>
        <div className="flex gap-0.5">
          <button
            onClick={() => onEdit(tx.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(tx.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
