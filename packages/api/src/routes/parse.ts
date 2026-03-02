import { Hono } from "hono";
import { parseInput } from "../services/parse";

export const parseRoute = new Hono();

parseRoute.post("/parse", async (c) => {
  const { text } = await c.req.json<{ text: string }>();

  if (!text || !text.trim()) {
    return c.json({ error: "text is required" }, 400);
  }

  const result = await parseInput(text.trim());
  return c.json(result);
});
