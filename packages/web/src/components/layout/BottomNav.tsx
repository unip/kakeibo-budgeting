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

export function BottomNav() {
  const { page, setPage, locale } = useAppStore();

  return (
    <nav className="flex border-t border-gray-800 bg-gray-950 md:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              page === item.page
                ? "text-purple-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            aria-label={t(item.labelKey, locale)}
          >
            <Icon className="h-5 w-5" />
            <span>{t(item.labelKey, locale)}</span>
          </button>
        );
      })}
    </nav>
  );
}
