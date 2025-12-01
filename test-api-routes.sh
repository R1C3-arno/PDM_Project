#!/bin/bash
BASE_URL="http://localhost:8080/api"
echo "🧪 Testing OLAVS Backend API Routes"
echo "Base URL: $BASE_URL"
echo ""

if ! curl -s "$BASE_URL/auth/health" > /dev/null 2>&1; then
    echo "❌ Backend not running! Start with: ./start-backend.sh"
    exit 1
fi

echo "✅ Backend is running!"
echo ""

test() {
    local m=$1 e=$2 d=$3
    local code=$(curl -s -o /dev/null -w "%{http_code}" -X $m "$BASE_URL$e" \
        ${d:+-H "Content-Type: application/json" -d "$d"})
    if [ "$code" -ge 200 ] && [ "$code" -lt 300 ]; then
        echo "✅ $m $e (HTTP $code)"
    elif [ "$code" -eq 401 ] || [ "$code" -eq 403 ]; then
        echo "⚠️  $m $e (HTTP $code - Auth required)"
    else
        echo "❌ $m $e (HTTP $code)"
    fi
}

echo "=== AUTH ==="
test GET /auth/health
test POST /auth/register '{"email":"test@test.com","password":"test123","fullName":"Test User"}'
test POST /auth/login '{"email":"test@test.com","password":"test123"}'

echo ""
echo "=== APPLICATIONS (V2) ==="
test GET /v2/applications
test GET /v2/applications/1
test GET /v2/applications/banker/queue
test GET /v2/applications/verifier/queue

echo ""
echo "=== DOCUMENTS (V2) ==="
test GET /v2/documents/application/1
test GET /v2/documents/1

echo ""
echo "=== VERIFICATIONS (V2) ==="
test GET /v2/verifications/application/1
test GET /v2/verifications/pending/kyc

echo ""
echo "=== OFFERS (V2) ==="
test GET /v2/offers/1
test GET /v2/offers/application/1

echo ""
echo "=== CONTRACTS (V2) ==="
test GET /v2/contracts/1
test GET /v2/contracts/application/1

echo ""
echo "=== REPAYMENTS (V2) ==="
test GET /v2/repayments/schedule/1
test GET /v2/repayments/installments/schedule/1

echo ""
echo "✅ API Testing Complete!"
