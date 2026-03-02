import { Hono } from "hono";
import { auth } from "../auth";

export const authRoute = new Hono();

authRoute.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});
