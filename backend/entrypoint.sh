#!/bin/sh
set -e

echo "============================================"
echo "  MK Academy Backend — starting up..."
echo "============================================"

# DATABASE_URL production uchun override (agar berilmagan bo'lsa)
export DATABASE_URL="${DATABASE_URL:-file:/app/data/prod.db}"

echo "→ DATABASE_URL: $DATABASE_URL"

echo ""
echo "→ Running Prisma migrations..."
npx prisma migrate deploy

echo ""
echo "→ Starting NestJS application on port ${PORT:-3232}..."
exec node dist/src/main.js
