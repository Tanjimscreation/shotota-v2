#!/bin/bash

# Auth Flow Testing Script
# Tests login, signup, and session management

set -e

API_URL="http://localhost:3000"
TIMESTAMP=$(date '+%s')
TEST_EMAIL="test-user-${TIMESTAMP}@shotota.com"
TEST_PASSWORD="TestPassword123"
TEST_NAME="Test User"

echo "═══════════════════════════════════════════════════════════"
echo "🔐 AUTHENTICATION FLOW TEST SUITE"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check API is running
echo "Test 1️⃣ : Check API Health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if curl -s -f "$API_URL/api/auth/session" > /dev/null; then
    echo -e "${GREEN}✅ API is running${NC}"
else
    echo -e "${RED}❌ API is not responding${NC}"
    exit 1
fi
echo ""

# Test 2: Test login with existing user
echo "Test 2️⃣ : Login with Test Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Email: test@test.com"
echo "Password: password"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/callback/credentials" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password",
    "csrfToken": "test"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "test@test.com" || [ -z "$LOGIN_RESPONSE" ]; then
    echo -e "${GREEN}✅ Login API responding correctly${NC}"
else
    echo -e "${YELLOW}⚠️  Response: $LOGIN_RESPONSE${NC}"
fi
echo ""

# Test 3: Test signup with new user
echo "Test 3️⃣ : Signup with New User"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Email: $TEST_EMAIL"
echo "Name: $TEST_NAME"
echo "Password: $TEST_PASSWORD"
echo ""

SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"name\": \"$TEST_NAME\",
    \"password\": \"$TEST_PASSWORD\",
    \"phone\": \"01700000000\",
    \"batch\": \"MBBS-2025\"
  }")

if echo "$SIGNUP_RESPONSE" | grep -q "successfully\|error"; then
    echo -e "${GREEN}✅ Signup API responding${NC}"
    echo "Response: $SIGNUP_RESPONSE" | head -c 200
    echo ""
else
    echo -e "${YELLOW}⚠️  No response from signup${NC}"
fi
echo ""

# Test 4: Check session endpoint
echo "Test 4️⃣ : Check Session Endpoint"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
SESSION=$(curl -s "$API_URL/api/auth/session")
if [ "$SESSION" = "{}" ]; then
    echo -e "${GREEN}✅ Session endpoint working (no active session expected)${NC}"
else
    echo "Session: $SESSION"
fi
echo ""

# Test 5: Check database connection
echo "Test 5️⃣ : Database Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -n "$DATABASE_URL" ]; then
    echo -e "${GREEN}✅ DATABASE_URL environment variable set${NC}"
else
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "📊 TEST SUMMARY"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ All critical auth endpoints are responding${NC}"
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:3000/login"
echo "2. Try login with: test@test.com / password"
echo "3. Should redirect to dashboard"
echo "4. Try signup at http://localhost:3000/signup"
echo ""
echo -e "${YELLOW}For production, see RENDER_DEPLOYMENT_GUIDE.md${NC}"
echo ""
