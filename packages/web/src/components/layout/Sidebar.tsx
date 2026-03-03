import type { Page } from "../../stores/app";
import { useAppStore } from "../../stores/app";
import { t } from "../../lib/i18n";
import { MessageSquare, BarChart3, List, Settings } from "lucide-react";

const NAV_ITEMS: { page: Page; icon: keyof typeof ICONS; labelKey: string }[] = [
  { page: "home", icon: "home", labelKey: "nav.home" },
  { page: "dashboard", icon: "dashboard", labelKey: "nav.dashboard" },
  { page: "history", icon: "history", labelKey: "nav.history" },
  { page: "settings", icon: "settings", labelKey: "nav.settings" },
];

const ICONS = {
  home: MessageSquare,
  dashboard: BarChart3,
  history: List,
  settings: Settings,
};

export function Sidebar() {
  const { page, setPage, locale } = useAppStore();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-gray-800 bg-gray-950">
      <div className="px-4 py-5">
        <h1 className="text-xl font-bold text-white">Kakeibo</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                page === item.page
                  ? "bg-purple-600/20 text-purple-400"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.labelKey, locale)}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
