#!/bin/bash

# Shotota v2 - Production Readiness Checklist
# Run this script to verify production readiness

set -e

echo "🔍 Shotota v2 - Production Readiness Verification"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

check_pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((PASSED++))
}

check_fail() {
  echo -e "${RED}✗${NC} $1"
  ((FAILED++))
}

check_info() {
  echo -e "${YELLOW}ℹ${NC} $1"
}

# 1. Check Node version
echo "📋 Checking Node.js version..."
if node --version | grep -E "v(18|19|20|21)" > /dev/null; then
  check_pass "Node.js version: $(node --version)"
else
  check_fail "Node.js version must be 18.x or higher"
fi
echo ""

# 2. Check npm installation
echo "📋 Checking npm..."
if npm --version > /dev/null 2>&1; then
  check_pass "npm installed: $(npm --version)"
else
  check_fail "npm not installed"
fi
echo ""

# 3. Check package.json
echo "📋 Checking package.json..."
if [ -f "package.json" ]; then
  check_pass "package.json exists"
else
  check_fail "package.json not found"
fi
echo ""

# 4. Check environment files
echo "📋 Checking environment configuration..."
if [ -f ".env.local" ]; then
  check_pass ".env.local exists"
else
  check_fail ".env.local missing (needed for development)"
fi

if [ -f ".env.production" ]; then
  check_pass ".env.production exists"
else
  check_fail ".env.production missing"
fi
echo ""

# 5. Check critical files
echo "📋 Checking critical application files..."
CRITICAL_FILES=(
  "next.config.ts"
  "app/api/auth/[...nextauth]/route.ts"
  "app/dashboard/page.tsx"
  "app/exam/page.tsx"
  "app/login/page.tsx"
  "src/components/DashboardLayout.tsx"
  "prisma/schema.prisma"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    check_pass "$file exists"
  else
    check_fail "$file missing"
  fi
done
echo ""

# 6. Check node_modules
echo "📋 Checking dependencies..."
if [ -d "node_modules" ]; then
  check_pass "node_modules exists"
else
  check_info "node_modules not found - run 'npm install' before deployment"
fi
echo ""

# 7. Check build
echo "📋 Testing production build..."
if npm run build > /dev/null 2>&1; then
  check_pass "Production build succeeds"
else
  check_fail "Production build failed"
fi
echo ""

# 8. Check TypeScript
echo "📋 Checking TypeScript compilation..."
if [ -d ".next" ]; then
  check_pass "Next.js build artifacts exist"
else
  check_fail "Next.js build artifacts missing"
fi
echo ""

# 9. Check documentation
echo "📋 Checking documentation..."
DOCS=(
  "README.md"
  "PRODUCTION_READY.md"
  "PRODUCTION_DEPLOYMENT.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    check_pass "$doc exists"
  else
    check_fail "$doc missing"
  fi
done
echo ""

# 10. Configuration checks
echo "📋 Checking configuration..."
if grep -q "NEXTAUTH_URL" ".env.local" 2>/dev/null || grep -q "NEXTAUTH_SECRET" ".env.local" 2>/dev/null; then
  check_pass "NextAuth environment variables present"
else
  check_info "NextAuth environment variables should be set for production"
fi
echo ""

# Summary
echo "=================================================="
echo "✅ PRODUCTION READINESS SUMMARY"
echo "=================================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ Application is production-ready!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Review PRODUCTION_DEPLOYMENT.md for deployment options"
  echo "2. Set up environment variables on your hosting platform"
  echo "3. Deploy using: npm run build && npm start"
  echo "4. Monitor logs and performance"
  exit 0
else
  echo -e "${RED}✗ Please fix the issues above before deploying to production${NC}"
  exit 1
fi
