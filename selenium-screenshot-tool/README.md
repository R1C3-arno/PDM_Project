# PDM Selenium Screenshot Automation Tool

Automated screenshot capture tool for the PDM Loan Management System using Selenium WebDriver. Captures all screens across different user roles for documentation, testing, and visual regression testing.

## Features

✅ **Multi-Role Support** - Capture screenshots as Admin, Banker, Verifier, Underwriter, or Applicant
✅ **Full Page Screenshots** - Automatically scrolls and stitches long pages
✅ **Automated Login** - Handles authentication for different roles
✅ **HTML Report Generation** - Creates visual report with all screenshots
✅ **Configurable** - JSON configuration for routes, credentials, and settings
✅ **Cross-Platform** - Works on Windows, macOS, and Linux

## Prerequisites

- Python 3.8 or higher
- Google Chrome browser
- PDM frontend running (default: http://localhost:3000)
- PDM backend running (default: http://localhost:8080)

## Installation

### 1. Navigate to Tool Directory

```bash
cd selenium-screenshot-tool
```

### 2. Create Virtual Environment (Recommended)

```bash
python3 -m venv venv

# Activate on macOS/Linux
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment (Optional)

```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### config.json

Main configuration file for the screenshot tool:

```json
{
  "base_url": "http://localhost:3000",
  "backend_url": "http://localhost:8080",
  "output_directory": "screenshots",
  "window_width": 1920,
  "window_height": 1080,
  "wait_timeout": 10,
  "screenshot_delay": 2,
  "full_page_screenshot": true,
  "headless": false,
  "credentials": {
    "admin": {
      "email": "admin@pdm.com",
      "password": "admin123"
    }
  },
  "routes": {
    "applicant": [
      "/dashboard",
      "/loans/apply",
      "/wallet"
    ]
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `base_url` | string | `http://localhost:3000` | Frontend application URL |
| `backend_url` | string | `http://localhost:8080` | Backend API URL |
| `output_directory` | string | `screenshots` | Directory for saving screenshots |
| `window_width` | number | `1920` | Browser window width |
| `window_height` | number | `1080` | Browser window height |
| `wait_timeout` | number | `10` | Maximum wait time (seconds) |
| `screenshot_delay` | number | `2` | Delay before capturing (seconds) |
| `full_page_screenshot` | boolean | `true` | Capture full scrollable page |
| `headless` | boolean | `false` | Run browser in headless mode |

## Usage

### Basic Usage

Capture all screenshots for all roles:

```bash
python screen_capture.py
```

### Advanced Usage

You can modify the script to capture specific roles or routes:

```python
# In screen_capture.py, modify main() function:

def main():
    capture = ScreenshotCapture()

    # Capture only applicant screens
    capture.capture_all_routes("applicant")

    # Or capture specific routes
    capture.login("admin")
    capture.capture_route("/admin/dashboard", "admin_dashboard", "Admin Dashboard")
    capture.logout()

    capture.generate_report()
    capture.close()
```

### Run in Headless Mode

Edit `config.json`:

```json
{
  "headless": true
}
```

Or modify the configuration programmatically:

```python
capture = ScreenshotCapture()
capture.config["headless"] = True
```

## Output

### Directory Structure

```
screenshots/
└── 20251125_143052/          # Timestamp directory
    ├── public_home.png
    ├── applicant_dashboard.png
    ├── applicant_loans_apply.png
    ├── admin_dashboard.png
    ├── admin_users.png
    ├── banker_dashboard.png
    └── report.html           # HTML report
```

### HTML Report

The tool generates an interactive HTML report (`report.html`) containing:
- Summary statistics
- All captured screenshots with metadata
- URLs and timestamps
- Descriptions for each screen

**Open the report:**

```bash
# macOS
open screenshots/[timestamp]/report.html

# Linux
xdg-open screenshots/[timestamp]/report.html

# Windows
start screenshots/[timestamp]/report.html
```

## Routes Configuration

Add or modify routes in `config.json`:

```json
{
  "routes": {
    "applicant": [
      "/dashboard",
      "/loans/apply",
      "/loans/calculator",
      "/loans/my-loans",
      "/wallet",
      "/transactions"
    ],
    "admin": [
      "/admin/dashboard",
      "/admin/users",
      "/admin/loans"
    ]
  }
}
```

### Route Naming Convention

Screenshots are named as: `{role}_{route_path}.png`

Examples:
- `/dashboard` → `applicant_dashboard.png`
- `/admin/users` → `admin_users.png`
- `/loans/apply` → `applicant_loans_apply.png`

## Credentials Management

### Option 1: config.json

Store credentials in `config.json`:

```json
{
  "credentials": {
    "admin": {
      "email": "admin@pdm.com",
      "password": "admin123"
    }
  }
}
```

### Option 2: Environment Variables

Use `.env` file (recommended for sensitive data):

```bash
ADMIN_EMAIL=admin@pdm.com
ADMIN_PASSWORD=admin123
```

Then modify `screen_capture.py` to read from environment:

```python
import os
credentials = {
    "email": os.getenv("ADMIN_EMAIL"),
    "password": os.getenv("ADMIN_PASSWORD")
}
```

## Troubleshooting

### Chrome Driver Issues

```bash
# Error: Chrome driver not found
# Solution: Reinstall webdriver-manager
pip install --upgrade webdriver-manager
```

### Screenshots Are Blank

```bash
# Increase screenshot delay in config.json
{
  "screenshot_delay": 5
}
```

### Login Fails

1. Check credentials in `config.json`
2. Verify frontend is running
3. Check login form selectors match your application
4. Increase `wait_timeout` if pages load slowly

### Element Not Found

If the script can't find login elements, update selectors in `screen_capture.py`:

```python
# Current selectors:
email_field = self.driver.find_element(By.NAME, "email")
password_field = self.driver.find_element(By.NAME, "password")

# If your form uses different attributes:
email_field = self.driver.find_element(By.ID, "email")
password_field = self.driver.find_element(By.ID, "password")
```

### Full Page Screenshot Issues

If full page stitching fails:

```json
{
  "full_page_screenshot": false
}
```

## Customization

### Custom Screenshot Logic

```python
class CustomScreenshotCapture(ScreenshotCapture):
    def capture_with_interactions(self, route, actions):
        """Capture screenshot after performing actions"""
        self.driver.get(f"{self.config['base_url']}{route}")

        # Perform custom actions
        for action in actions:
            action(self.driver)

        self.capture_screenshot(f"custom_{route}")

# Usage
capture = CustomScreenshotCapture()
capture.login("admin")

def open_modal(driver):
    button = driver.find_element(By.ID, "open-modal")
    button.click()

capture.capture_with_interactions("/admin/users", [open_modal])
```

### Add Watermark to Screenshots

```python
from PIL import Image, ImageDraw, ImageFont

def add_watermark(image_path, text="PDM System"):
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("Arial.ttf", 36)
    draw.text((10, 10), text, font=font, fill=(255, 0, 0, 128))
    img.save(image_path)
```

## Performance Optimization

### Parallel Execution

For faster screenshot capture, run multiple instances:

```python
from multiprocessing import Process

def capture_role(role):
    capture = ScreenshotCapture()
    capture.capture_all_routes(role)
    capture.close()

if __name__ == "__main__":
    roles = ["applicant", "admin", "banker"]
    processes = [Process(target=capture_role, args=(role,)) for role in roles]

    for p in processes:
        p.start()

    for p in processes:
        p.join()
```

### Reduce Screenshot Size

```python
from PIL import Image

def compress_screenshot(path, quality=85):
    img = Image.open(path)
    img.save(path, optimize=True, quality=quality)
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  screenshots:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          cd selenium-screenshot-tool
          pip install -r requirements.txt

      - name: Start PDM services
        run: |
          docker-compose up -d

      - name: Wait for services
        run: sleep 30

      - name: Capture screenshots
        run: |
          cd selenium-screenshot-tool
          python screen_capture.py

      - name: Upload screenshots
        uses: actions/upload-artifact@v2
        with:
          name: screenshots
          path: selenium-screenshot-tool/screenshots/
```

## Best Practices

1. **Version Control**: Add `screenshots/` to `.gitignore`
2. **Credentials**: Never commit real credentials to config.json
3. **Headless Mode**: Use headless mode in CI/CD pipelines
4. **Error Handling**: Always use try-except blocks for robustness
5. **Cleanup**: Close driver in finally blocks
6. **Wait Times**: Adjust timeouts based on your application's performance
7. **Screenshot Organization**: Use timestamp directories to track changes over time

## FAQ

**Q: Can I capture screenshots of specific screen resolutions?**

A: Yes, modify `window_width` and `window_height` in config.json or create multiple configurations:

```python
resolutions = [
    (1920, 1080),  # Desktop
    (1366, 768),   # Laptop
    (768, 1024),   # Tablet
    (375, 667)     # Mobile
]

for width, height in resolutions:
    capture.config["window_width"] = width
    capture.config["window_height"] = height
    capture.capture_all_routes()
```

**Q: How do I capture modal dialogs or dropdowns?**

A: Add custom interaction logic:

```python
def capture_modal(self):
    # Open modal
    open_btn = self.driver.find_element(By.ID, "open-modal")
    open_btn.click()
    time.sleep(1)

    # Capture
    self.capture_screenshot("modal_open")

    # Close modal
    close_btn = self.driver.find_element(By.CLASS_NAME, "modal-close")
    close_btn.click()
```

**Q: Can I compare screenshots for visual regression?**

A: Yes, integrate with tools like `pixelmatch`:

```bash
pip install pixelmatch
```

**Q: How do I capture screenshots in dark mode?**

A: Add dark mode toggle before capturing:

```python
def enable_dark_mode(self):
    self.driver.execute_script("""
        document.body.classList.add('dark-mode');
    """)
    time.sleep(1)
```

## License

MIT License - See LICENSE file

## Support

For issues and questions:
- Check the Troubleshooting section
- Review error messages in console output
- Ensure all services are running

## Changelog

### Version 1.0 (2025-11-25)
- Initial release
- Multi-role screenshot capture
- Full page screenshot support
- HTML report generation
- JSON configuration
- Automated login/logout

---

**Created by:** PDM Team
**Last Updated:** November 25, 2025
