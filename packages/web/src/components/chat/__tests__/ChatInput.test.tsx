import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "../ChatInput";

describe("ChatInput", () => {
  it("renders input and send button", () => {
    render(<ChatInput onSend={vi.fn()} />);
    expect(screen.getByPlaceholderText(/type/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onSend with text and clears input", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    const input = screen.getByPlaceholderText(/type/i);
    fireEvent.change(input, { target: { value: "coffee 45k" } });
    fireEvent.click(screen.getByRole("button"));
    expect(onSend).toHaveBeenCalledWith("coffee 45k");
    expect(input).toHaveValue("");
  });

  it("does not send empty text", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("sends on Enter key", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    const input = screen.getByPlaceholderText(/type/i);
    fireEvent.change(input, { target: { value: "lunch 25k" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith("lunch 25k");
  });

  it("disables when loading", () => {
    render(<ChatInput onSend={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText(/type/i)).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
