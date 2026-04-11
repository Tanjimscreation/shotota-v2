#!/bin/bash

# Phase 7 Database Migration Setup
# ================================

echo "🗄️  Setting up PostgreSQL database migration for Shatota..."

# Step 1: Ensure PostgreSQL is running
echo "📍 Step 1: Starting PostgreSQL container..."
if ! docker ps | grep -q shotota_postgres; then
  echo "   Starting docker-compose..."
  docker-compose up -d
  sleep 3
else
  echo "   ✅ PostgreSQL already running"
fi

# Step 2: Create migration
echo "📍 Step 2: Creating Prisma migration..."
npx prisma migrate dev --name init

# Step 3: Generate Prisma client
echo "📍 Step 3: Regenerating Prisma client..."
npx prisma generate

# Step 4: Run seed script
echo "📍 Step 4: Seeding database with mock data..."
npx prisma db seed

echo "✨ Database migration completed successfully!"
echo ""
echo "📊 Database Stats:"
npx prisma studio &

# Open Prisma Studio in browser
sleep 2
open http://localhost:5555
