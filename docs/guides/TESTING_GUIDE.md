# PDM Project - Manual Testing Guide

**Server Status:** ✅ RUNNING
**Generated:** November 24, 2025

---

## 🌐 Server URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ Running |
| **Backend API** | http://localhost:8080/api | ✅ Running |
| **Health Check** | http://localhost:8080/api/auth/health | ✅ Active |

---

## 🔑 Test Credentials

### Test Users in Database

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| `admin@loanweb.com` | `password123` | ADMIN | Admin testing |
| `john.doe@example.com` | `password123` | USER | Regular user |
| `jane.smith@example.com` | `password123` | USER | Regular user |
| `bob.johnson@example.com` | `password123` | USER | Regular user |

---

## 🧪 Manual Test Scenarios

### 1. Frontend Testing

**Landing Page:**
1. Open http://localhost:3000
2. ✅ Should see OLAVS landing page
3. ✅ Navigation menu should be visible
4. ✅ "Apply Now" and "Banker Login" buttons visible

**Registration Flow:**
1. Click "Apply Now" or navigate to http://localhost:3000/register
2. Try weak password (e.g., `weak123`):
   - ❌ Should fail with validation error
   - Message: "Password must contain at least one uppercase letter..."
3. Try strong password (e.g., `StrongPass123!`):
   - ✅ Should accept
4. Submit form
   - If email exists: Error message
   - If new email: Success and redirect

**Login Flow:**
1. Navigate to http://localhost:3000/login
2. Enter credentials: `admin@loanweb.com` / `password123`
3. ✅ Should login successfully
4. ✅ Should redirect to dashboard

---

### 2. Backend API Testing

#### Test 1: Health Check
```bash
curl http://localhost:8080/api/auth/health

Expected Response:
{
  "status": "ok",
  "message": "API is running"
}
```

#### Test 2: Login with Valid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@loanweb.com",
    "password": "password123"
  }'

Expected Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "admin@loanweb.com",
    "fullName": "Admin User",
    "role": "ADMIN",
    "status": "ACTIVE"
  }
}
```

#### Test 3: Login with Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@loanweb.com",
    "password": "wrongpassword"
  }'

Expected Response:
{
  "message": "Invalid credentials",
  "remainingAttempts": 4
}
```

#### Test 4: Account Lockout (Security Feature)
```bash
# Try 5 failed login attempts
for i in {1..5}; do
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -s | jq .
done

# 6th attempt should show lockout
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  -s | jq .

Expected Response (after 5 attempts):
{
  "message": "Account is temporarily locked due to too many failed login attempts",
  "minutesRemaining": 30
}
```

#### Test 5: Rate Limiting (Security Feature)
```bash
# Send 101 requests rapidly
for i in {1..101}; do
  curl -s http://localhost:8080/api/auth/health > /dev/null
  echo "Request $i"
done

# Should get HTTP 429 after 100 requests
curl -i http://localhost:8080/api/auth/health

Expected Response (after limit):
HTTP/1.1 429 Too Many Requests
{
  "message": "Too many requests. Please try again later.",
  "status": 429
}
```

#### Test 6: Security Headers
```bash
curl -I http://localhost:8080/api/auth/health

Expected Headers:
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ X-XSS-Protection: 1; mode=block
✅ Content-Security-Policy: default-src 'self'; ...
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: geolocation=(), microphone=(), camera=()
```

#### Test 7: CORS Headers
```bash
curl -i -X OPTIONS http://localhost:8080/api/auth/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"

Expected Headers:
✅ Access-Control-Allow-Origin: http://localhost:3000
✅ Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
✅ Access-Control-Allow-Credentials: true
```

#### Test 8: Protected Endpoint (without token)
```bash
curl -i http://localhost:8080/api/users

Expected Response:
HTTP/1.1 403 Forbidden
```

#### Test 9: Protected Endpoint (with token)
```bash
# First, get a token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@loanweb.com","password":"password123"}' \
  | jq -r '.token')

# Then use it
curl -i http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

Expected Response:
HTTP/1.1 200 OK
{
  "id": 1,
  "email": "admin@loanweb.com",
  "fullName": "Admin User",
  "role": "ADMIN",
  "status": "ACTIVE"
}
```

---

### 3. Security Feature Testing

#### Password Strength Validation

**Test Weak Passwords (should all fail):**
- `weak` - Too short, no uppercase, no special char
- `password` - No uppercase, no number, no special char
- `Password` - No number, no special char
- `Password1` - No special char
- `password1!` - No uppercase

**Test Strong Passwords (should all pass):**
- `StrongPass123!` ✅
- `MySecure2024@` ✅
- `Complex$Pass99` ✅
- `Test1234!Secure` ✅

```bash
# Test registration with weak password
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "weak",
    "fullName": "New User"
  }' | jq .

Expected: 400 Bad Request with validation error
```

---

### 4. Database Testing

#### View Users
```bash
docker exec pdm-mysql mysql -uroot -prootpassword pdm-project \
  -e "SELECT id, email, full_name, role, status FROM users;"
```

#### View Wallets
```bash
docker exec pdm-mysql mysql -uroot -prootpassword pdm-project \
  -e "SELECT id, user_id, balance, currency, status FROM wallets;"
```

#### View Transactions
```bash
docker exec pdm-mysql mysql -uroot -prootpassword pdm-project \
  -e "SELECT id, user_id, type, amount, description FROM transactions LIMIT 10;"
```

---

## 🎯 Test Checklist

### Frontend Tests
- [ ] Landing page loads
- [ ] Registration page loads
- [ ] Login page loads
- [ ] Password validation works
- [ ] Form validation shows errors
- [ ] Successful login redirects to dashboard
- [ ] Logout works
- [ ] Protected routes redirect to login

### Backend API Tests
- [ ] Health endpoint responds
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials fails
- [ ] Account lockout after 5 failed attempts
- [ ] Rate limiting kicks in after 100 requests
- [ ] Security headers are present
- [ ] CORS headers work for allowed origins
- [ ] JWT token is generated on login
- [ ] Protected endpoints require authentication
- [ ] Password validation rejects weak passwords

### Security Tests
- [ ] Passwords must be 12+ characters
- [ ] Passwords require uppercase, lowercase, digit, special char
- [ ] Account locks after 5 failed login attempts
- [ ] Rate limiting prevents DoS (100 req/min)
- [ ] Security headers prevent XSS, clickjacking
- [ ] CORS only allows specific origins
- [ ] JWT secret is externalized
- [ ] No credentials in code

### Database Tests
- [ ] Database connection works
- [ ] Users table has test data
- [ ] Wallets table has test data
- [ ] Transactions table has test data
- [ ] Queries execute successfully

---

## 🐛 Troubleshooting

### Frontend Not Loading
```bash
# Check if process is running
lsof -ti:3000

# Check logs
tail -f pdm-frontend/frontend.log

# Restart
./stop-all.sh
./start-servers.sh
```

### Backend Not Responding
```bash
# Check if process is running
lsof -ti:8080

# Check logs
tail -f pdm-backend/backend.log

# Check for errors
grep -i "error\|exception" pdm-backend/backend.log

# Restart
./stop-all.sh
./start-servers.sh
```

### Database Connection Issues
```bash
# Check MySQL container
docker ps | grep pdm-mysql

# Check connectivity
mysql -h 127.0.0.1 -P 3306 -u pdm_user -ppdm_password pdm-project -e "SELECT 1;"

# Restart MySQL
docker restart pdm-mysql
```

---

## 🛑 Stopping Servers

```bash
# Use the stop script
./stop-all.sh

# Or manually
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

---

## 📊 Expected Performance

- **Backend Startup:** 3-5 seconds
- **Frontend Startup:** 5-10 seconds
- **API Response Time:** < 200ms (average)
- **Database Query Time:** < 50ms (average)
- **Login Request:** < 500ms

---

## ✅ Test Results Template

Copy and fill out:

```
Date: ___________
Tester: ___________

Frontend:
[ ] Landing page: ___________
[ ] Login page: ___________
[ ] Registration: ___________

Backend:
[ ] Health check: ___________
[ ] Login API: ___________
[ ] Rate limiting: ___________
[ ] Account lockout: ___________
[ ] Security headers: ___________

Security:
[ ] Password validation: ___________
[ ] JWT tokens: ___________
[ ] CORS: ___________

Issues Found:
1. ___________
2. ___________

Overall Status: [ ] PASS  [ ] FAIL
```

---

**Happy Testing! 🎉**

For issues or questions, check:
- Backend logs: `pdm-backend/backend.log`
- Frontend logs: `pdm-frontend/frontend.log`
- Documentation: `PROJECT_DOCUMENTATION.md`
- Audit report: `AUDIT_REPORT.md`
- Fixes report: `FIXES_IMPLEMENTED.md`
