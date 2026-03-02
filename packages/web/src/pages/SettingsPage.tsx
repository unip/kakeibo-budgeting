import { useState } from "react";
import { useAppStore } from "../stores/app";
import { t } from "../lib/i18n";
import { api } from "../lib/api";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function SettingsPage() {
  const { locale, setLocale } = useAppStore();
  const [month] = useState(currentMonth());
  const [budgets, setBudgets] = useState({
    needsBudget: "",
    wantsBudget: "",
    cultureBudget: "",
    unexpectedBudget: "",
    income: "",
  });
  const [saved, setSaved] = useState(false);

  const handleSaveBudget = async () => {
    const data: Record<string, number> = {};
    for (const [key, val] of Object.entries(budgets)) {
      if (val) data[key] = parseInt(val);
    }
    await api.setBudget(month, data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-full flex-col bg-gray-950">
      <header className="border-b border-gray-800 px-4 py-3">
        <h1 className="text-lg font-bold text-white">
          {t("settings.title", locale)}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Language */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 mb-2">
            {t("settings.language", locale)}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setLocale("en")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                locale === "en"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLocale("id")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                locale === "id"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Bahasa Indonesia
            </button>
          </div>
        </section>

        {/* Monthly Budget */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 mb-2">
            {t("settings.budget", locale)} — {month}
          </h2>
          <div className="space-y-3">
            {(
              [
                ["needsBudget", "pillar.needs"],
                ["wantsBudget", "pillar.wants"],
                ["cultureBudget", "pillar.culture"],
                ["unexpectedBudget", "pillar.unexpected"],
                ["income", "dashboard.totalIncome"],
              ] as const
            ).map(([key, labelKey]) => (
              <div key={key}>
                <label className="text-xs text-gray-500">
                  {t(labelKey, locale)}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={budgets[key]}
                  onChange={(e) =>
                    setBudgets((b) => ({ ...b, [key]: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
            <button
              onClick={handleSaveBudget}
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
            >
              {t("settings.saveBudget", locale)}
            </button>
            {saved && (
              <p className="text-xs text-green-400">
                {t("settings.budgetSaved", locale)}
              </p>
            )}
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 mb-2">
            {t("settings.about", locale)}
          </h2>
          <p className="text-sm text-gray-500">
            {t("settings.aboutText", locale)}
          </p>
        </section>
      </div>
    </div>
  );
}
