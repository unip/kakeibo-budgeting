import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PillarCard } from "../PillarCard";

describe("PillarCard", () => {
  it("renders pillar name and spent amount", () => {
    render(<PillarCard pillar="needs" spent={150000} budget={2000000} />);
    expect(screen.getByText(/needs/i)).toBeInTheDocument();
    expect(screen.getByText(/150\.000/)).toBeInTheDocument();
  });

  it("renders budget amount", () => {
    render(<PillarCard pillar="wants" spent={95000} budget={1000000} />);
    expect(screen.getByText(/1\.000\.000/)).toBeInTheDocument();
  });

  it("shows progress bar", () => {
    render(<PillarCard pillar="culture" spent={250000} budget={500000} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.getAttribute("aria-valuenow")).toBe("50");
  });

  it("handles null budget gracefully", () => {
    render(<PillarCard pillar="unexpected" spent={0} budget={null} />);
    expect(screen.getByText(/no budget set/i)).toBeInTheDocument();
  });

  it("shows over-budget warning when spent exceeds budget", () => {
    render(<PillarCard pillar="wants" spent={1500000} budget={1000000} />);
    expect(screen.getByText(/over budget/i)).toBeInTheDocument();
  });
});
