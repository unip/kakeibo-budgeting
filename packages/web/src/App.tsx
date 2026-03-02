import { useAppStore } from "./stores/app";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";

const PAGES = {
  home: HomePage,
  dashboard: DashboardPage,
  history: HistoryPage,
  settings: SettingsPage,
} as const;

export default function App() {
  const page = useAppStore((s) => s.page);
  const PageComponent = PAGES[page];

  return (
    <AppShell>
      <PageComponent />
    </AppShell>
  );
}
