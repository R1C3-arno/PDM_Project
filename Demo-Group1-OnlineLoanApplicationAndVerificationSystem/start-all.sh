#!/bin/bash

# PDM Loan Management System - Start All Servers
# This script starts both Backend and Frontend in separate terminal windows

echo "🚀 Starting PDM Loan Management System..."
echo ""

PROJECT_DIR="/Users/it/Documents/GitHub/Ollama-fastapi/PDM_Project"

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Detected macOS - Opening in separate Terminal windows..."
    
    # Start Backend in new Terminal window
    osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_DIR' && bash start-backend.sh"
    activate
end tell
EOF
    
    # Wait a bit for backend to start
    sleep 3
    
    # Start Frontend in new Terminal window
    osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_DIR' && bash start-frontend.sh"
end tell
EOF
    
    echo "✅ Servers starting in separate Terminal windows!"
    echo ""
    echo "Backend:  http://localhost:8080/api"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "To stop: Run ./stop-all.sh or close the Terminal windows"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected Linux - Opening in separate terminal windows..."
    
    # Try different terminal emulators
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$PROJECT_DIR' && bash start-backend.sh; exec bash"
        sleep 3
        gnome-terminal -- bash -c "cd '$PROJECT_DIR' && bash start-frontend.sh; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole -e "cd '$PROJECT_DIR' && bash start-backend.sh" &
        sleep 3
        konsole -e "cd '$PROJECT_DIR' && bash start-frontend.sh" &
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$PROJECT_DIR' && bash start-backend.sh" &
        sleep 3
        xterm -e "cd '$PROJECT_DIR' && bash start-frontend.sh" &
    else
        echo "❌ No supported terminal emulator found"
        echo "Please run start-backend.sh and start-frontend.sh manually in separate terminals"
        exit 1
    fi
    
    echo "✅ Servers starting in separate terminal windows!"
else
    echo "❌ Unsupported OS. Please run start-backend.sh and start-frontend.sh manually"
    exit 1
fi

