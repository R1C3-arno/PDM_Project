@echo off
REM ============================================================================
REM PDM Screenshot Capture Tool - Windows Runner Script
REM ============================================================================

echo ==========================================
echo PDM Screenshot Capture Tool
echo ==========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Virtual environment not found. Creating...
    python -m venv venv
    echo [OK] Virtual environment created
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if dependencies are installed
python -c "import selenium" 2>nul
if errorlevel 1 (
    echo Dependencies not installed. Installing...
    pip install -r requirements.txt
    echo [OK] Dependencies installed
)

REM Check if config file exists
if not exist "config.json" (
    echo [ERROR] config.json not found!
    echo Please create config.json based on the example in README.md
    pause
    exit /b 1
)

echo.
echo Starting screenshot capture...
echo ==========================================
echo.

REM Run the script
python screen_capture.py

echo.
echo ==========================================
echo [OK] Screenshot capture complete!
echo.
echo Check the screenshots directory for output
echo.
pause
