import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomNav } from "../BottomNav";
import { useAppStore } from "../../../stores/app";

describe("BottomNav", () => {
  beforeEach(() => {
    useAppStore.setState({ page: "home", locale: "en" });
  });

  it("renders all 4 nav items", () => {
    render(<BottomNav />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("switches page on click", () => {
    render(<BottomNav />);
    fireEvent.click(screen.getByText("Dashboard"));
    expect(useAppStore.getState().page).toBe("dashboard");
  });

  it("renders in Bahasa Indonesia when locale is id", () => {
    useAppStore.setState({ locale: "id" });
    render(<BottomNav />);
    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(screen.getByText("Dasbor")).toBeInTheDocument();
    expect(screen.getByText("Riwayat")).toBeInTheDocument();
    expect(screen.getByText("Pengaturan")).toBeInTheDocument();
  });
});
