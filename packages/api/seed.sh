#!/bin/sh
# Seed script for Docker container
# Run with: docker compose exec app sh /app/packages/api/seed.sh

cd /app/packages/api

echo "Seeding database..."

# Insert default user if not exists
psql -h db -U kakeibo -d kakeibo -c "INSERT INTO users (id, display_name) VALUES ('00000000-0000-0000-0000-000000000000', 'Default User') ON CONFLICT (id) DO NOTHING;"

# Insert default categories
psql -h db -U kakeibo -d kakeibo -c "INSERT INTO categories (user_id, name, pillar, icon) VALUES 
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
ON CONFLICT DO NOTHING;"

echo "Database seeded successfully!"
