import type { Context, Next } from "hono";
import { auth } from "../auth";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Auth middleware: if user is authenticated, sets userId from session.
 * If not authenticated, falls back to default user (single-user mode).
 */
export async function authMiddleware(c: Context, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (session?.user) {
      c.set("userId", session.user.id);
    } else {
      c.set("userId", DEFAULT_USER_ID);
    }
  } catch {
    c.set("userId", DEFAULT_USER_ID);
  }
  await next();
}
