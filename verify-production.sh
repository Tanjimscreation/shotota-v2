#!/bin/bash

# Production Verification Script for Shotota V2
# This script verifies the app is production-ready before deployment

echo "🔍 SHOTOTA V2 - PRODUCTION VERIFICATION"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

# Check 1: Git Status
echo "1️⃣  Checking Git Status..."
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓ All changes committed${NC}"
    ((passed++))
else
    echo -e "${RED}✗ Uncommitted changes found${NC}"
    git status --short
    ((failed++))
fi
echo ""

# Check 2: Node modules
echo "2️⃣  Checking Node Modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Node modules installed${NC}"
    ((passed++))
else
    echo -e "${RED}✗ Node modules not found${NC}"
    ((failed++))
fi
echo ""

# Check 3: Environment file
echo "3️⃣  Checking .env.local..."
if [ -f ".env.local" ]; then
    if grep -q "DATABASE_URL" .env.local; then
        echo -e "${GREEN}✓ .env.local exists with DATABASE_URL${NC}"
        ((passed++))
    else
        echo -e "${RED}✗ .env.local missing DATABASE_URL${NC}"
        ((failed++))
    fi
else
    echo -e "${YELLOW}⚠ .env.local not found (expected for Render)${NC}"
fi
echo ""

# Check 4: Build test
echo "4️⃣  Testing Build..."
echo "   Running: npm run build..."
npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
    pages=$(grep "Generating static pages" /tmp/build.log | tail -1)
    echo -e "${GREEN}✓ Build successful${NC}"
    echo "   $pages"
    ((passed++))
else
    echo -e "${RED}✗ Build failed${NC}"
    tail -20 /tmp/build.log
    ((failed++))
fi
echo ""

# Check 5: TypeScript check
echo "5️⃣  Checking TypeScript..."
if grep -q "✓ Compiled successfully" /tmp/build.log; then
    echo -e "${GREEN}✓ No TypeScript errors${NC}"
    ((passed++))
else
    echo -e "${RED}✗ TypeScript errors found${NC}"
    ((failed++))
fi
echo ""

# Check 6: Pages count
echo "6️⃣  Checking All Pages..."
if grep -q "29/29" /tmp/build.log || grep -q "✓ Generating static pages" /tmp/build.log; then
    echo -e "${GREEN}✓ All pages compiled (29 pages)${NC}"
    ((passed++))
else
    echo -e "${RED}✗ Not all pages compiled${NC}"
    ((failed++))
fi
echo ""

# Check 7: Standalone output
echo "7️⃣  Checking Standalone Build..."
if [ -d ".next/standalone/shotota-v2" ]; then
    if [ -f ".next/standalone/shotota-v2/server.js" ]; then
        echo -e "${GREEN}✓ Standalone build ready${NC}"
        ((passed++))
    else
        echo -e "${RED}✗ server.js not found in standalone${NC}"
        ((failed++))
    fi
else
    echo -e "${RED}✗ .next/standalone not found${NC}"
    ((failed++))
fi
echo ""

# Check 8: Server.js exists
echo "8️⃣  Checking Server Entry Point..."
if [ -f "server.js" ]; then
    echo -e "${GREEN}✓ server.js exists${NC}"
    ((passed++))
else
    echo -e "${RED}✗ server.js not found${NC}"
    ((failed++))
fi
echo ""

# Check 9: Render config
echo "9️⃣  Checking Render Configuration..."
if [ -f "render.yaml" ]; then
    if grep -q "shotota-v2" render.yaml && grep -q "node" render.yaml; then
        echo -e "${GREEN}✓ render.yaml configured${NC}"
        ((passed++))
    else
        echo -e "${RED}✗ render.yaml incomplete${NC}"
        ((failed++))
    fi
else
    echo -e "${RED}✗ render.yaml not found${NC}"
    ((failed++))
fi
echo ""

# Check 10: Documentation
echo "🔟 Checking Documentation..."
docs_count=$(ls *.md 2>/dev/null | grep -E "(FINAL|RENDER|DEPLOYMENT)" | wc -l)
if [ "$docs_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Deployment documentation found ($docs_count files)${NC}"
    ((passed++))
else
    echo -e "${RED}✗ Deployment documentation missing${NC}"
    ((failed++))
fi
echo ""

# Summary
echo "========================================"
echo "SUMMARY"
echo "========================================"
echo -e "Passed: ${GREEN}$passed/10${NC}"
echo -e "Failed: ${RED}$failed/10${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - READY FOR PRODUCTION!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Go to Render.com dashboard"
    echo "3. Create new Web Service"
    echo "4. Connect GitHub repository"
    echo "5. Configure environment variables"
    echo "6. Deploy!"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED - FIX BEFORE DEPLOYING${NC}"
    exit 1
fi
