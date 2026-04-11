#!/bin/bash

# Shotota v2 - Quick Start Script
# This script helps you get started with Shotota locally

set -e

echo "🚀 Shotota v2 - Quick Start"
echo "=============================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm detected: $(npm --version)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Ask user what they want to do
echo "What would you like to do?"
echo ""
echo "1) Start development server (npm run dev)"
echo "2) Build for production (npm run build)"
echo "3) Start production server (npm start)"
echo "4) Run type check (npm run typecheck)"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting development server..."
        echo "📍 Open http://localhost:3000 in your browser"
        echo "📝 Login with: rahim@shotota.com / hashed_password_123 (admin)"
        echo "📝 Or: test@test.com / password (student)"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🔨 Building for production..."
        npm run build
        echo ""
        echo "✅ Build complete! Use 'npm start' to run the production server"
        ;;
    3)
        echo ""
        echo "🚀 Starting production server..."
        echo "📍 Open http://localhost:3000 in your browser"
        npm start
        ;;
    4)
        echo ""
        echo "🔍 Running TypeScript type check..."
        npm run typecheck
        echo ""
        echo "✅ Type check complete!"
        ;;
    5)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice. Please enter 1-5."
        exit 1
        ;;
esac
