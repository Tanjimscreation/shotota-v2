#!/bin/bash

echo "🚀 Fast Deploy to Vercel..."

# Just push to git - Vercel auto-deploys
echo "📤 Pushing code..."
git add -A
git commit -m "deploy: Production deployment" 2>/dev/null || true
git push origin main

echo "✅ Pushed! Vercel will auto-deploy..."
echo "📊 Check deployment status:"
echo "   https://vercel.com/dashboard"
echo "   (auto-deployment starts in 30 seconds)"
