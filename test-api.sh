#!/bin/bash

echo "=== PDM Backend API Test Suite ==="
echo ""

BASE_URL="http://localhost:8080"
COOKIE_JAR="/tmp/pdm_test_cookies.txt"
rm -f $COOKIE_JAR

echo "1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser1@pdm.com","password":"TestPass123@","fullName":"Test User","phoneNumber":"+1234567890"}' \
  -c $COOKIE_JAR)

echo "$REGISTER_RESPONSE" | jq .
REGISTER_SUCCESS=$(echo "$REGISTER_RESPONSE" | jq -r .success)

if [ "$REGISTER_SUCCESS" == "true" ]; then
  echo "✅ Registration successful"
else
  echo "❌ Registration failed"
fi

echo ""
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser1@pdm.com","password":"TestPass123@"}' \
  -c $COOKIE_JAR)

echo "$REGISTER_RESPONSE" | jq .
LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r .success)

if [ "$LOGIN_SUCCESS" == "true" ]; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
fi

echo ""
echo "3. Cookies set:"
cat $COOKIE_JAR | grep -v "^#"

echo ""
echo "4. Testing /me endpoint..."
ME_RESPONSE=$(curl -s "$BASE_URL/api/auth/me" -b $COOKIE_JAR)
echo "$ME_RESPONSE" | jq .

USER_EMAIL=$(echo "$ME_RESPONSE" | jq -r .email 2>/dev/null)
if [ "$USER_EMAIL" == "testuser1@pdm.com" ]; then
  echo "✅ /me endpoint successful"
else
  echo "❌ /me endpoint failed"
fi

echo ""
echo "5. Testing database..."
docker exec pdm-mysql mysql -updm_user -ppdm_password pdm-project -e "SELECT id, email, full_name, role, status FROM users WHERE email = 'testuser1@pdm.com';" 2>/dev/null

echo ""
echo "=== Test Summary ==="
echo "Registration: $([ "$REGISTER_SUCCESS" == "true" ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "Login: $([ "$LOGIN_SUCCESS" == "true" ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "/me endpoint: $([ "$USER_EMAIL" == "testuser1@pdm.com" ] && echo "✅ PASS" || echo "❌ FAIL")"
