import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "@kakeibo/shared";
import { api } from "../lib/api";
import { FilterBar } from "../components/transactions/FilterBar";
import { TransactionList } from "../components/transactions/TransactionList";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(currentMonth());
  const [pillar, setPillar] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions({
        month: month || undefined,
        pillar: pillar || undefined,
        search: search || undefined,
      });
      setTransactions(data);
    } catch {
      // TODO: error handling
    } finally {
      setLoading(false);
    }
  }, [month, pillar, search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await api.deleteTransaction(id);
    fetchTransactions();
  };

  const handleEdit = (id: string) => {
    // TODO: open edit modal
    console.log("edit", id);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <header className="border-b border-gray-800 px-4 py-3">
        <h1 className="text-lg font-bold text-white">History</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <FilterBar
          month={month}
          pillar={pillar}
          search={search}
          onMonthChange={setMonth}
          onPillarChange={setPillar}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="flex h-40 items-center justify-center text-gray-500">
            Loading...
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
