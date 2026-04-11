#!/bin/bash

echo "🚀 Deploying Shotota v2 to Vercel..."

# Kill any existing servers
lsof -i :3000 -i :3001 -i :3002 -i :3003 | grep node | awk '{print $2}' | sort -u | xargs kill -9 2>/dev/null

# Clean and build
rm -rf .next
npm run build

# Deploy to Vercel
echo "📦 Pushing to Vercel..."
git push origin main

# Use Vercel CLI
npx vercel --prod --yes --name=shotota-v2

echo "✅ Deployment complete!"
