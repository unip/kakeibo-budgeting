import { create } from "zustand";

export type Page = "home" | "dashboard" | "history" | "settings";
export type Locale = "en" | "id";

interface AppStore {
  page: Page;
  locale: Locale;
  setPage: (page: Page) => void;
  setLocale: (locale: Locale) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  page: "home",
  locale: (localStorage.getItem("kakeibo-locale") as Locale) || "en",
  setPage: (page) => set({ page }),
  setLocale: (locale) => {
    localStorage.setItem("kakeibo-locale", locale);
    set({ locale });
  },
}));
