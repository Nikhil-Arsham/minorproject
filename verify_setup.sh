#!/bin/bash

echo "🔍 HackerRank Platform - Setup Verification Script"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print result
check_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ $2${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ $2${NC}"
    ((FAILED++))
  fi
}

check_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
  ((WARNINGS++))
}

echo "📋 Checking System Setup..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  check_result 0 "Node.js installed: $NODE_VERSION"
else
  check_result 1 "Node.js not found (required)"
fi

# Check npm
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  check_result 0 "npm installed: $NPM_VERSION"
else
  check_result 1 "npm not found (required)"
fi

echo ""
echo "📁 Checking Backend Setup..."
echo ""

# Check backend directory
if [ -d "backend" ]; then
  check_result 0 "Backend directory exists"
else
  check_result 1 "Backend directory not found"
fi

# Check backend .env
if [ -f "backend/.env" ]; then
  check_result 0 "Backend .env file exists"
  
  # Check .env contents
  if grep -q "MONGODB_URL" backend/.env; then
    check_result 0 "MONGODB_URL configured"
  else
    check_result 1 "MONGODB_URL missing in .env"
  fi
  
  if grep -q "PORT=3001" backend/.env; then
    check_result 0 "PORT=3001 configured correctly"
  else
    check_result 1 "PORT not configured correctly"
  fi
  
  if grep -q "JWT_SECRET" backend/.env; then
    check_result 0 "JWT_SECRET configured"
  else
    check_result 1 "JWT_SECRET missing in .env"
  fi
else
  check_result 1 "Backend .env file not found"
fi

# Check backend node_modules
if [ -d "backend/node_modules" ]; then
  check_result 0 "Backend dependencies installed"
else
  check_warning "Backend dependencies not installed (run: cd backend && npm install)"
fi

echo ""
echo "📁 Checking Frontend Setup..."
echo ""

# Check frontend directory
if [ -d "frontend" ]; then
  check_result 0 "Frontend directory exists"
else
  check_result 1 "Frontend directory not found"
fi

# Check frontend .env
if [ -f "frontend/.env" ]; then
  check_result 0 "Frontend .env file exists"
  
  # Check .env contents
  if grep -q "REACT_APP_API_URL" frontend/.env; then
    check_result 0 "REACT_APP_API_URL configured"
  else
    check_result 1 "REACT_APP_API_URL missing in .env"
  fi
else
  check_result 1 "Frontend .env file not found"
fi

# Check frontend node_modules
if [ -d "frontend/node_modules" ]; then
  check_result 0 "Frontend dependencies installed"
else
  check_warning "Frontend dependencies not installed (run: cd frontend && npm install)"
fi

echo ""
echo "🔧 Checking Code Fixes..."
echo ""

# Check if template literal is fixed in ProblemDetails.js
if grep -q 'axios.post(`${process.env.REACT_APP_API_URL}/submissions`' frontend/src/pages/ProblemDetails.js; then
  check_result 0 "Template literal fixed in ProblemDetails.js (line 40)"
else
  check_result 1 "Template literal not fixed in ProblemDetails.js"
fi

# Check optional auth middleware
if [ -f "backend/middleware/optionalAuth.js" ]; then
  check_result 0 "Optional auth middleware created"
else
  check_result 1 "Optional auth middleware not found"
fi

# Check contestId in Submission model
if grep -q "contestId" backend/models/Submission.js; then
  check_result 0 "contestId field added to Submission model"
else
  check_result 1 "contestId field not found in Submission model"
fi

# Check if submission status is fixed
if grep -q "submission.status = allPassed ? 'accepted' : 'wrong_answer'" backend/controllers/Submission.js; then
  check_result 0 "Submission status logic fixed"
else
  check_result 1 "Submission status logic not fixed"
fi

echo ""
echo "📚 Checking Documentation..."
echo ""

# Check documentation files
DOCS=("PROJECT_ANALYSIS.md" "SETUP_GUIDE.md" "FEATURES_GUIDE.md" "CHANGES_MADE.md" "ANALYSIS_SUMMARY.md" "QUICK_REFERENCE.md")

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    check_result 0 "$doc exists"
  else
    check_result 1 "$doc missing"
  fi
done

echo ""
echo "=================================================="
echo "📊 Summary:"
echo "   ✅ Passed: $PASSED"
echo "   ❌ Failed: $FAILED"
echo "   ⚠️  Warnings: $WARNINGS"
echo "=================================================="

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Setup is complete.${NC}"
  echo ""
  echo "🚀 Next steps:"
  echo "   1. Terminal 1: cd backend && node server.js"
  echo "   2. Terminal 2: cd frontend && npm start"
  echo "   3. Browser: http://localhost:3000"
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Setup complete but with warnings. Please review above.${NC}"
  exit 0
else
  echo -e "${RED}❌ Setup has errors. Please fix the issues above.${NC}"
  exit 1
fi