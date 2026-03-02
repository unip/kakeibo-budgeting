import type { Page } from "../../stores/app";
import { useAppStore } from "../../stores/app";
import { t } from "../../lib/i18n";

const NAV_ITEMS: { page: Page; icon: string; labelKey: string }[] = [
  { page: "home", icon: "💬", labelKey: "nav.home" },
  { page: "dashboard", icon: "📊", labelKey: "nav.dashboard" },
  { page: "history", icon: "📋", labelKey: "nav.history" },
  { page: "settings", icon: "⚙️", labelKey: "nav.settings" },
];

export function BottomNav() {
  const { page, setPage, locale } = useAppStore();

  return (
    <nav className="flex border-t border-gray-800 bg-gray-950 md:hidden">
      {NAV_ITEMS.map((item) => (
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
          <span className="text-lg">{item.icon}</span>
          <span>{t(item.labelKey, locale)}</span>
        </button>
      ))}
    </nav>
  );
}
