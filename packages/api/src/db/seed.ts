import { db } from "./index";
import { users, categories } from "./schema";
import { DEFAULT_CATEGORIES } from "@kakeibo/shared";
import { eq } from "drizzle-orm";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

async function seed() {
  console.log("Seeding database...");

  // Seed default user
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.id, DEFAULT_USER_ID));

  if (existing.length === 0) {
    await db.insert(users).values({
      id: DEFAULT_USER_ID,
      displayName: "Default User",
    });
    console.log("Created default user");
  }

  // Seed default categories
  for (const cat of DEFAULT_CATEGORIES) {
    await db
      .insert(categories)
      .values({
        userId: DEFAULT_USER_ID,
        name: cat.name,
        pillar: cat.pillar,
        icon: cat.icon,
      })
      .onConflictDoNothing();
  }
  console.log("Seeded default categories");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
