import type { Transaction } from "@kakeibo/shared";
import { TransactionItem } from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function groupByDate(txs: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of txs) {
    const date = tx.transactionDate;
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
  }
  return groups;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-500">
        No transactions found
      </div>
    );
  }

  const grouped = groupByDate(transactions);
  const dates = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date}>
          <h3 className="mb-2 text-sm font-medium text-gray-400">{date}</h3>
          <div className="space-y-2">
            {grouped[date].map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
