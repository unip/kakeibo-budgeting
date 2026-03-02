import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { parseRoute } from "./routes/parse";
import { transactionsRoute } from "./routes/transactions";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/api/health", (c) => c.json({ status: "ok" }));
app.route("/api", parseRoute);
app.route("/api", transactionsRoute);

const port = Number(process.env.PORT) || 3000;
console.log(`Server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
