import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { parseRoute } from "./routes/parse";
import { transactionsRoute } from "./routes/transactions";
import { dashboardRoute } from "./routes/dashboard";
import { authRoute } from "./routes/auth";
import { db } from "./db";
import * as schema from "./db/schema";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// Serve static frontend files
app.use("/*", serveStatic({ root: path.join(__dirname, "../../web/dist") }));

// API routes
app.get("/api/health", (c) => c.json({ status: "ok" }));
app.route("/api", parseRoute);
app.route("/api", transactionsRoute);
app.route("/api", dashboardRoute);
app.route("", authRoute);

// Serve index.html for all non-API routes (SPA routing)
app.get("*", (c) => {
  return c.html("", 200);
});

const port = Number(process.env.PORT) || 3000;

// Test database connection on startup
async function start() {
  try {
    await db.select().from(schema.users).limit(1);
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }

  console.log(`Server running on port ${port}`);
  
  serve({
    fetch: app.fetch,
    port,
  });
}

start();
