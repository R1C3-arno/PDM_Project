#!/bin/bash

# Verification Script: Check for Sensitive Data in Logs
# Task T1.1 - Remove Sensitive Data from Logs
# PDM Project Security Remediation

set -e

echo "========================================"
echo "Sensitive Data Logging Verification"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0
TOTAL_CHECKS=0

# Function to check and report
check_pattern() {
    local description="$1"
    local pattern="$2"
    local path="$3"
    local exclude_dirs="${4:-}"

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo "[$TOTAL_CHECKS] Checking: $description"

    local grep_cmd="grep -r"
    if [ -n "$exclude_dirs" ]; then
        grep_cmd="$grep_cmd --exclude-dir={$exclude_dirs}"
    fi

    if $grep_cmd -n "$pattern" "$path" 2>/dev/null; then
        echo -e "${RED}✗ FAILED${NC}: Found instances of $description"
        FAILED=$((FAILED + 1))
        return 1
    else
        echo -e "${GREEN}✓ PASSED${NC}: No $description found"
        return 0
    fi
    echo ""
}

echo "=== Backend Java Security Checks ==="
echo ""

# Check 1: System.out/System.err logging
check_pattern \
    "System.out/System.err logging statements" \
    "System\.\(out\|err\)\.print" \
    "pdm-backend/src/main/java" \
    "test,target"

# Check 2: Password logging
check_pattern \
    "password logging (direct)" \
    "log.*password\|print.*password\|System.*password" \
    "pdm-backend/src/main/java" \
    "test,target"

# Check 3: Password hash logging (in actual log statements)
check_pattern \
    "password hash in log statements" \
    "log.*getPassword\|print.*getPassword\|System.*getPassword" \
    "pdm-backend/src/main/java" \
    "test,target"

# Check 4: JWT token logging
check_pattern \
    "JWT token logging" \
    "log.*token\|print.*token\|System.*jwt\|System.*token" \
    "pdm-backend/src/main/java" \
    "test,target"

# Check 5: Email + password in actual log statements
check_pattern \
    "email and password in same log statement" \
    "log.*email.*password\|log.*password.*email\|System.*email.*password\|System.*password.*email\|print.*email.*password\|print.*password.*email" \
    "pdm-backend/src/main/java" \
    "test,target"

# Check 6: Credential logging
check_pattern \
    "credential logging" \
    "log.*credential\|print.*credential\|System.*credential" \
    "pdm-backend/src/main/java" \
    "test,target"

# Check 7: Secret logging
check_pattern \
    "secret logging" \
    "log.*secret\|print.*secret\|System.*secret" \
    "pdm-backend/src/main/java" \
    "test,target"

echo ""
echo "=== Frontend JavaScript/TypeScript Security Checks ==="
echo ""

# Check 8: Password in console.log (exclude node_modules more effectively)
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo "[$TOTAL_CHECKS] Checking: password in console logs"
if grep -r "console\.log.*password\|console\.debug.*password" pdm-frontend/src pdm-frontend/app pdm-frontend/contexts pdm-frontend/lib 2>/dev/null; then
    echo -e "${RED}✗ FAILED${NC}: Found instances of password in console logs"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No password in console logs found"
fi

# Check 9: Token in console.log
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo "[$TOTAL_CHECKS] Checking: token in console logs"
if grep -r "console\.log.*token\|console\.debug.*token\|console\.log.*jwt" pdm-frontend/src pdm-frontend/app pdm-frontend/contexts pdm-frontend/lib 2>/dev/null; then
    echo -e "${RED}✗ FAILED${NC}: Found instances of token in console logs"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No token in console logs found"
fi

# Check 10: User data in console.log
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo "[$TOTAL_CHECKS] Checking: full user objects in console logs"
if grep -r "console\.log.*user\.password\|console\.log.*data\.password" pdm-frontend/src pdm-frontend/app pdm-frontend/contexts pdm-frontend/lib 2>/dev/null; then
    echo -e "${RED}✗ FAILED${NC}: Found instances of full user objects in console logs"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No full user objects in console logs found"
fi

# Check 11: Credentials in console.log
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo "[$TOTAL_CHECKS] Checking: credentials in console logs"
if grep -r "console\.log.*credential\|console\.debug.*credential" pdm-frontend/src pdm-frontend/app pdm-frontend/contexts pdm-frontend/lib 2>/dev/null; then
    echo -e "${RED}✗ FAILED${NC}: Found instances of credentials in console logs"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No credentials in console logs found"
fi

# Check 12: Auth headers in console.log
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo "[$TOTAL_CHECKS] Checking: auth headers in console logs"
if grep -r "console\.log.*Authorization\|console\.log.*Bearer" pdm-frontend/src pdm-frontend/app pdm-frontend/contexts pdm-frontend/lib 2>/dev/null; then
    echo -e "${RED}✗ FAILED${NC}: Found instances of auth headers in console logs"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No auth headers in console logs found"
fi

echo ""
echo "=== Configuration File Security Checks ==="
echo ""

# Check 13: Hardcoded secrets in .env files
if [ -f "pdm-backend/.env" ]; then
    echo -e "${YELLOW}⚠ WARNING${NC}: .env file exists in repository"
    echo "  File: pdm-backend/.env"
    echo "  This file should be in .gitignore and not committed"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No .env file in repository"
fi

# Check 14: Hardcoded secrets in config files (not environment variables)
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
echo "[$TOTAL_CHECKS] Checking: hardcoded passwords in config files"
# Look for password: followed by a value that doesn't start with ${
if grep -r "password:\s*[^$]" pdm-backend/src/main/resources/*.yml pdm-backend/src/main/resources/*.properties 2>/dev/null | grep -v "password: \${"; then
    echo -e "${RED}✗ FAILED${NC}: Found instances of hardcoded passwords in config files"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No hardcoded passwords in config files found"
fi

echo ""
echo "=== Log File Checks ==="
echo ""

# Check 15: No log files with sensitive data in repo
if find . -name "*.log" -type f 2>/dev/null | grep -v node_modules | grep -v .next | head -1; then
    echo -e "${YELLOW}⚠ WARNING${NC}: Log files found in repository"
    echo "  These should be in .gitignore"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ PASSED${NC}: No log files in repository"
fi

# Check 16: Verify .gitignore includes logs
if grep -q "^\*\.log$" .gitignore 2>/dev/null || grep -q "^logs/" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}: .gitignore includes log files"
else
    echo -e "${YELLOW}⚠ WARNING${NC}: .gitignore does not exclude *.log files"
    echo "  Recommendation: Add '*.log' to .gitignore"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "========================================"
echo "Verification Summary"
echo "========================================"
echo "Total Checks: $TOTAL_CHECKS"
echo "Failed Checks: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED${NC}"
    echo "No sensitive data logging detected!"
    exit 0
else
    echo -e "${RED}✗ $FAILED CHECKS FAILED${NC}"
    echo "Please review and fix the issues above."
    exit 1
fi
