import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "../FilterBar";

describe("FilterBar", () => {
  const defaults = {
    month: "2026-03",
    pillar: "",
    search: "",
    onMonthChange: vi.fn(),
    onPillarChange: vi.fn(),
    onSearchChange: vi.fn(),
  };

  it("renders month input, pillar chips, and search", () => {
    render(<FilterBar {...defaults} />);
    expect(screen.getByDisplayValue("2026-03")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByText("Needs")).toBeInTheDocument();
    expect(screen.getByText("Wants")).toBeInTheDocument();
    expect(screen.getByText("Culture")).toBeInTheDocument();
    expect(screen.getByText("Unexpected")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing", () => {
    render(<FilterBar {...defaults} />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "coffee" },
    });
    expect(defaults.onSearchChange).toHaveBeenCalledWith("coffee");
  });

  it("calls onPillarChange when clicking a chip", () => {
    render(<FilterBar {...defaults} />);
    fireEvent.click(screen.getByText("Wants"));
    expect(defaults.onPillarChange).toHaveBeenCalledWith("wants");
  });

  it("calls onPillarChange with empty string to clear filter", () => {
    render(<FilterBar {...defaults} pillar="wants" />);
    fireEvent.click(screen.getByText("Wants"));
    expect(defaults.onPillarChange).toHaveBeenCalledWith("");
  });

  it("calls onMonthChange when month input changes", () => {
    render(<FilterBar {...defaults} />);
    fireEvent.change(screen.getByDisplayValue("2026-03"), {
      target: { value: "2026-04" },
    });
    expect(defaults.onMonthChange).toHaveBeenCalledWith("2026-04");
  });
});
