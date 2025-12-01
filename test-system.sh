#!/bin/bash

echo "🔍 PDM System Health Check"
echo "================================"
echo ""

# 1. Check backend
echo "1️⃣ Testing Backend API..."
BACKEND_HEALTH=$(curl -s http://localhost:8080/api/auth/health)
if [[ $BACKEND_HEALTH == *"ok"* ]]; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is NOT responding"
fi
echo ""

# 2. Check frontend
echo "2️⃣ Testing Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" -eq 200 ]; then
    echo "   ✅ Frontend is running"
else
    echo "   ❌ Frontend is NOT responding"
fi
echo ""

# 3. Check database
echo "3️⃣ Testing Database Connection..."
DB_CHECK=$(docker exec pdm-mysql mysql -updm_user -ppdm_password -e "SELECT 1" 2>&1 | grep -v "Warning")
if [[ $DB_CHECK == "1" ]]; then
    echo "   ✅ Database is connected"
else
    echo "   ❌ Database is NOT connected"
fi
echo ""

# 4. Test login
echo "4️⃣ Testing Authentication..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"applicant5@example.com","password":"password123"}')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo "   ✅ Login successful"
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
    echo "   📝 Token: ${TOKEN:0:30}..."
else
    echo "   ❌ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
fi
echo ""

# 5. Check data
echo "5️⃣ Checking Database Records..."
echo "   📊 Tables:"
docker exec pdm-mysql mysql -updm_user -ppdm_password pdm-project -e "
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'applications', COUNT(*) FROM applications
UNION ALL SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications;
" 2>&1 | grep -v Warning | tail -6
echo ""

# 6. Summary
echo "================================"
echo "✅ System Health Check Complete!"
echo ""
echo "📍 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080/api"
echo ""
echo "🔑 Test Accounts:"
echo "   Admin:     admin@loanweb.com / password123"
echo "   Applicant: applicant5@example.com / password123"
echo "   Banker:    banker1@loanweb.com / password123"
echo ""
echo "📚 Documentation:"
echo "   Demo Guide:     DEMO_GUIDE.md"
echo "   Database ERD:   DATABASE_ERD_MERMAID.md"
echo "   Data Summary:   SEEDED_DATA_SUMMARY.md"
echo ""
