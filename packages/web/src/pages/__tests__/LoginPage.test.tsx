import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "../LoginPage";

// Mock auth client
vi.mock("../../lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: vi.fn().mockResolvedValue({ data: { session: { token: "abc" } } }),
    },
    signUp: {
      email: vi.fn().mockResolvedValue({ data: { user: { id: "1" } } }),
    },
  },
}));

describe("LoginPage", () => {
  it("renders login form by default", () => {
    render(<LoginPage onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("switches to signup form", () => {
    render(<LoginPage onSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText(/sign up/i));
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("switches back to login form", () => {
    render(<LoginPage onSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText(/sign up/i));
    fireEvent.click(screen.getByText(/sign in/i));
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
