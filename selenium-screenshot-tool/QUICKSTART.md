# Quick Start Guide - PDM Screenshot Tool

Get started with the PDM Selenium Screenshot Tool in 5 minutes!

## Prerequisites

- ✅ Python 3.8+
- ✅ Google Chrome installed
- ✅ PDM Frontend running on http://localhost:3000
- ✅ PDM Backend running on http://localhost:8080

## Installation (One-Time Setup)

### macOS/Linux

```bash
# 1. Navigate to tool directory
cd selenium-screenshot-tool

# 2. Create virtual environment
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt
```

### Windows

```bash
# 1. Navigate to tool directory
cd selenium-screenshot-tool

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt
```

## Quick Run

### Option 1: Using Runner Script (Recommended)

**macOS/Linux:**
```bash
./run.sh
```

**Windows:**
```bash
run.bat
```

### Option 2: Direct Python

```bash
# Activate virtual environment first
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Run the tool
python screen_capture.py
```

## Configuration

Before first run, ensure `config.json` has correct credentials:

```json
{
  "credentials": {
    "admin": {
      "email": "admin@pdm.com",
      "password": "admin123"
    },
    "applicant": {
      "email": "user@pdm.com",
      "password": "user123"
    }
  }
}
```

## What Happens?

1. **Browser Opens** - Chrome launches automatically
2. **Login** - Tool logs in with each role
3. **Navigation** - Visits all configured routes
4. **Screenshots** - Captures full-page screenshots
5. **Report** - Generates HTML report with all images
6. **Output** - Saves to `screenshots/[timestamp]/`

## View Results

```bash
# macOS
open screenshots/[latest-timestamp]/report.html

# Linux
xdg-open screenshots/[latest-timestamp]/report.html

# Windows
start screenshots/[latest-timestamp]/report.html
```

## Common Issues

### "Chrome driver not found"

```bash
pip install --upgrade webdriver-manager
```

### "Frontend not running"

Start your frontend first:

```bash
cd pdm-frontend
npm run dev
```

### "Login failed"

Update credentials in `config.json` to match your test accounts.

### Screenshots are blank

Increase delay in `config.json`:

```json
{
  "screenshot_delay": 5
}
```

## Customize Routes

Edit `config.json` to add/remove routes:

```json
{
  "routes": {
    "applicant": [
      "/dashboard",
      "/loans/apply",
      "/wallet"
    ]
  }
}
```

## Headless Mode

For faster execution without visible browser:

```json
{
  "headless": true
}
```

## Output Structure

```
screenshots/
└── 20251125_143052/
    ├── applicant_dashboard.png
    ├── applicant_loans_apply.png
    ├── applicant_wallet.png
    ├── admin_dashboard.png
    └── report.html
```

## Next Steps

- 📖 Read full [README.md](README.md) for advanced usage
- ⚙️ Customize routes in `config.json`
- 🔐 Update credentials for your environment
- 📊 Use reports for documentation

## Support

**Issues?** Check [README.md](README.md) Troubleshooting section

---

**Ready to go!** 🚀

Just run `./run.sh` (macOS/Linux) or `run.bat` (Windows)
