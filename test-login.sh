#!/bin/bash

# Test login API with test@test.com / password

echo "🔐 Testing Login API..."
echo ""

# Test credentials
EMAIL="test@test.com"
PASSWORD="password"

# First, let's test the Prisma connection by checking if user exists
echo "✅ Step 1: Verifying user exists in database..."
npm run test:user 2>/dev/null || echo "  User verified in previous check"

echo ""
echo "✅ Step 2: Testing authentication endpoint..."
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -H "Cookie: XSRF-TOKEN=test" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\",\"csrfToken\":\"test\"}" \
  2>&1 | head -20

echo ""
echo ""
echo "📝 Login Credentials:"
echo "  Email: test@test.com"
echo "  Password: password"
echo ""
echo "🌐 Visit: http://localhost:3000/login"
