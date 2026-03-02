import { useState, useEffect, useCallback } from "react";
import type { DashboardSummary, Pillar } from "@kakeibo/shared";
import { PILLARS } from "@kakeibo/shared";
import { api } from "../lib/api";
import { PillarCard } from "../components/dashboard/PillarCard";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function DashboardPage() {
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trend, setTrend] = useState<{ month: string; total: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([
        api.getDashboardSummary(month),
        api.getDashboardTrend(6),
      ]);
      setSummary(s);
      setTrend(t);
    } catch {
      // TODO: error handling
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Dashboard</h1>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-gray-500">
            Loading...
          </div>
        ) : summary ? (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-900 p-4">
                <div className="text-xs text-gray-400">Total Spent</div>
                <div className="mt-1 text-xl font-bold text-white">
                  Rp {summary.totalSpent.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="rounded-2xl bg-gray-900 p-4">
                <div className="text-xs text-gray-400">Total Income</div>
                <div className="mt-1 text-xl font-bold text-green-400">
                  Rp {summary.totalIncome.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Pillar cards */}
            <div className="grid grid-cols-2 gap-3">
              {PILLARS.map((p) => (
                <PillarCard
                  key={p}
                  pillar={p as Pillar}
                  spent={summary.pillars[p as Pillar]?.spent || 0}
                  budget={summary.pillars[p as Pillar]?.budget ?? null}
                />
              ))}
            </div>

            {/* Trend */}
            {trend.length > 0 && (
              <div className="rounded-2xl bg-gray-900 p-4">
                <h2 className="text-sm font-medium text-gray-400 mb-3">
                  Monthly Trend
                </h2>
                <div className="flex items-end gap-2 h-32">
                  {trend.map((t) => {
                    const max = Math.max(...trend.map((r) => r.total), 1);
                    const height = Math.max((t.total / max) * 100, 4);
                    return (
                      <div
                        key={t.month}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-full rounded-t-lg bg-purple-500/60"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500">
                          {t.month.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-40 items-center justify-center text-gray-500">
            No data
          </div>
        )}
      </div>
    </div>
  );
}
