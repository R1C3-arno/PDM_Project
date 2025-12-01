#!/bin/bash

# Start Backend (Spring Boot) Server

echo "================================================"
echo "🔧 Starting PDM Backend Server (Spring Boot)"
echo "================================================"
echo ""

cd "$(dirname "$0")/pdm-backend"

# Load environment variables from .env file
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven first."
    exit 1
fi

# Check database connection
echo "📊 Checking MySQL connection..."
echo "   Host: 34.143.226.168:3306"
echo "   Database: loan_management"
echo ""

# Start the server
echo "🚀 Starting Spring Boot server..."
echo "   This may take a minute on first run..."
echo ""

mvn spring-boot:run

# If Maven exits, show message
echo ""
echo "❌ Backend server stopped."
echo "Press any key to close..."
read -n 1

