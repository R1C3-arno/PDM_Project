#!/bin/bash

# Stop all PDM servers

echo "🛑 Stopping PDM Loan Management System..."
echo ""

# Stop processes on port 8080 (Backend)
echo "Stopping Backend (port 8080)..."
lsof -ti:8080 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend stopped"
else
    echo "ℹ️  No backend process found on port 8080"
fi

# Stop processes on port 3000 (Frontend)
echo "Stopping Frontend (port 3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend stopped"
else
    echo "ℹ️  No frontend process found on port 3000"
fi

# Stop processes on port 3001 (Frontend alternative)
echo "Stopping Frontend (port 3001)..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend (port 3001) stopped"
else
    echo "ℹ️  No frontend process found on port 3001"
fi

# Stop processes on port 3002 (Frontend alternative)
echo "Stopping Frontend (port 3002)..."
lsof -ti:3002 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend (port 3002) stopped"
else
    echo "ℹ️  No frontend process found on port 3002"
fi

# Kill any remaining Maven processes
echo "Stopping Maven processes..."
pkill -f "mvn spring-boot:run" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Maven processes stopped"
fi

# Kill any remaining npm processes
echo "Stopping npm processes..."
pkill -f "npm run dev" 2>/dev/null
pkill -f "next dev" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ npm processes stopped"
fi

# Clean up Next.js lock files
echo "Cleaning up lock files..."
rm -f /Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project/pdm-frontend/.next/dev/lock 2>/dev/null
echo "✅ Lock files cleaned"

echo ""
echo "✅ All servers stopped!"

