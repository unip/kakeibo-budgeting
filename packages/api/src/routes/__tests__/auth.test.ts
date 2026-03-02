import { describe, it, expect, vi } from "vitest";
import { Hono } from "hono";
import { authRoute } from "../auth";

// Mock the auth handler
vi.mock("../../auth", () => ({
  auth: {
    handler: vi.fn().mockImplementation((req: Request) => {
      const url = new URL(req.url);
      if (url.pathname === "/api/auth/get-session") {
        return new Response(JSON.stringify({ session: null }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.pathname === "/api/auth/sign-up/email" && req.method === "POST") {
        return new Response(
          JSON.stringify({ user: { id: "1", email: "test@test.com" } }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      if (url.pathname === "/api/auth/sign-in/email" && req.method === "POST") {
        return new Response(
          JSON.stringify({ session: { token: "abc" }, user: { id: "1" } }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response("Not found", { status: 404 });
    }),
  },
}));

describe("auth routes", () => {
  const app = new Hono().route("", authRoute);

  it("handles GET /api/auth/get-session", async () => {
    const res = await app.request("/api/auth/get-session");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("session");
  });

  it("handles POST /api/auth/sign-up/email", async () => {
    const res = await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@test.com",
        password: "password123",
        name: "Test",
      }),
    });
    expect(res.status).toBe(200);
  });

  it("handles POST /api/auth/sign-in/email", async () => {
    const res = await app.request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@test.com",
        password: "password123",
      }),
    });
    expect(res.status).toBe(200);
  });
});
