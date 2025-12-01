#!/bin/bash
###############################################################################
# PDM Screenshot Capture Tool - Runner Script
# This script sets up the environment and runs the screenshot capture tool
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "PDM Screenshot Capture Tool"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import selenium" 2>/dev/null; then
    echo -e "${YELLOW}Dependencies not installed. Installing...${NC}"
    pip install -r requirements.txt
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Check if config file exists
if [ ! -f "config.json" ]; then
    echo -e "${RED}✗ config.json not found!${NC}"
    echo "Please create config.json based on the example in README.md"
    exit 1
fi

# Check if frontend is running
echo "Checking if frontend is running..."
FRONTEND_URL=$(python3 -c "import json; print(json.load(open('config.json'))['base_url'])")

if curl -s --head "$FRONTEND_URL" | grep "200 OK" > /dev/null; then
    echo -e "${GREEN}✓ Frontend is running at $FRONTEND_URL${NC}"
else
    echo -e "${RED}✗ Frontend is not running at $FRONTEND_URL${NC}"
    echo "Please start the frontend application first"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "Starting screenshot capture..."
echo "=========================================="
echo ""

# Run the script
python screen_capture.py

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Screenshot capture complete!${NC}"
echo ""
echo "Check the screenshots directory for output"
echo ""
