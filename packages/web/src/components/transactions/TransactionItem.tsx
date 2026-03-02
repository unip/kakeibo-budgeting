import type { Transaction } from "@kakeibo/shared";

const PILLAR_BADGE: Record<string, string> = {
  needs: "bg-blue-600/20 text-blue-400",
  wants: "bg-purple-600/20 text-purple-400",
  culture: "bg-amber-600/20 text-amber-400",
  unexpected: "bg-pink-600/20 text-pink-400",
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

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3">
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
      <div className="flex items-center gap-3">
        <span
          className={`font-bold ${isIncome ? "text-green-400" : "text-white"}`}
        >
          {isIncome ? "+" : "-"}Rp {tx.amount.toLocaleString("id-ID")}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(tx.id)}
            className="rounded-lg p-1.5 text-xs text-gray-400 hover:bg-gray-800 hover:text-white"
            aria-label="Edit"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(tx.id)}
            className="rounded-lg p-1.5 text-xs text-gray-400 hover:bg-gray-800 hover:text-red-400"
            aria-label="Delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
