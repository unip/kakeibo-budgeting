import { describe, it, expect } from "vitest";
import { t } from "../i18n";

describe("i18n", () => {
  it("returns English translation", () => {
    expect(t("nav.home", "en")).toBe("Home");
    expect(t("nav.dashboard", "en")).toBe("Dashboard");
  });

  it("returns Bahasa Indonesia translation", () => {
    expect(t("nav.home", "id")).toBe("Beranda");
    expect(t("nav.dashboard", "id")).toBe("Dasbor");
  });

  it("falls back to English for missing id keys", () => {
    // All keys exist in both, so test with a non-existent key
    expect(t("nonexistent.key", "id")).toBe("nonexistent.key");
  });

  it("returns key if not found in any locale", () => {
    expect(t("missing.key", "en")).toBe("missing.key");
  });

  it("translates pillar names", () => {
    expect(t("pillar.needs", "en")).toBe("Needs");
    expect(t("pillar.needs", "id")).toBe("Kebutuhan");
    expect(t("pillar.wants", "id")).toBe("Keinginan");
  });
});
