#!/bin/bash

# Start Frontend (Next.js) Server

echo "================================================"
echo "🎨 Starting PDM Frontend Server (Next.js)"
echo "================================================"
echo ""

cd "$(dirname "$0")/pdm-frontend"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🚀 Starting Next.js development server..."
echo ""
echo "   Backend API: http://localhost:8080/api"
echo "   Frontend:    http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev

# If npm exits, show message
echo ""
echo "❌ Frontend server stopped."
echo "Press any key to close..."
read -n 1

