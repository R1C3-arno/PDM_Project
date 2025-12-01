#!/bin/bash

cd /Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project

echo "🔧 Setting up environment..."

# Set environment variables for backend
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_NAME=pdm-project
export DB_USERNAME=pdm_user
export DB_PASSWORD=pdm_password
export JWT_SECRET="GwRpwXqxADt18i3UhM8JHlekobrdXAiRwY8LzF2D7WJoKBOSNRHxWQENOHRtkSHsAxqkNVascoKgZOZdfne5Gg=="
export SERVER_PORT=8080
export CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

echo "🚀 Starting Backend Server..."
cd pdm-backend
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

cd ..

echo "🚀 Starting Frontend Server..."
cd pdm-frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

cd ..

echo ""
echo "⏳ Waiting for servers to start (30 seconds)..."
sleep 30

echo ""
echo "📊 Server Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test backend
BACKEND_STATUS=$(curl -s http://localhost:8080/api/auth/health 2>&1)
if [[ $BACKEND_STATUS == *"ok"* ]]; then
    echo "✅ Backend:  RUNNING on http://localhost:8080/api"
else
    echo "❌ Backend:  FAILED (check pdm-backend/backend.log)"
fi

# Test frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>&1)
if [[ $FRONTEND_STATUS == "200" ]]; then
    echo "✅ Frontend: RUNNING on http://localhost:3000"
else
    echo "❌ Frontend: FAILED (check pdm-frontend/frontend.log)"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Test Credentials:"
echo "   Email:    admin@loanweb.com"
echo "   Password: password123"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080/api"
echo "   Health:   http://localhost:8080/api/auth/health"
echo ""
echo "🛑 To stop servers:"
echo "   ./stop-all.sh"
echo ""
