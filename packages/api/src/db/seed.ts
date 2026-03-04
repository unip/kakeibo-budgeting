import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const host = process.env.DB_HOST || 'db';
const user = process.env.DB_USER || 'kakeibo';
const password = process.env.DB_PASSWORD || 'kakeibo';
const database = process.env.DB_NAME || 'kakeibo';

const connectionString = `postgres://${user}:${password}@${host}:5432/${database}`;

async function seed() {
  console.log('Seeding database...');
  
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    // Insert default user
    await client`
      INSERT INTO users (id, display_name) 
      VALUES ('00000000-0000-0000-0000-000000000000', 'Default User') 
      ON CONFLICT (id) DO NOTHING
    `;
    console.log('✓ Default user created');

    // Insert default categories
    await client`
      INSERT INTO categories (user_id, name, pillar, icon) VALUES 
      ('00000000-0000-0000-0000-000000000000', 'Food & Groceries', 'needs', '🍚'),
      ('00000000-0000-0000-0000-000000000000', 'Transport', 'needs', '🚌'),
      ('00000000-0000-0000-0000-000000000000', 'Bills & Utilities', 'needs', '💡'),
      ('00000000-0000-0000-0000-000000000000', 'Health', 'needs', '🏥'),
      ('00000000-0000-0000-0000-000000000000', 'Dining Out', 'wants', '🍽️'),
      ('00000000-0000-0000-0000-000000000000', 'Shopping', 'wants', '🛍️'),
      ('00000000-0000-0000-0000-000000000000', 'Entertainment', 'wants', '🎮'),
      ('00000000-0000-0000-0000-000000000000', 'Coffee & Drinks', 'wants', '☕'),
      ('00000000-0000-0000-0000-000000000000', 'Books', 'culture', '📚'),
      ('00000000-0000-0000-0000-000000000000', 'Courses', 'culture', '🎓'),
      ('00000000-0000-0000-0000-000000000000', 'Hobbies', 'culture', '🎨'),
      ('00000000-0000-0000-0000-000000000000', 'Music', 'culture', '🎵'),
      ('00000000-0000-0000-0000-000000000000', 'Medical', 'unexpected', '💊'),
      ('00000000-0000-0000-0000-000000000000', 'Repairs', 'unexpected', '🔧'),
      ('00000000-0000-0000-0000-000000000000', 'Emergency', 'unexpected', '🚨')
      ON CONFLICT DO NOTHING
    `;
    console.log('✓ Default categories created');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
