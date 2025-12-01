#!/usr/bin/env python3
"""
PDM Loan Management System - Selenium Screenshot Automation Tool
Captures screenshots of all application screens for documentation and testing

Author: PDM Team
Version: 1.0
Date: 2025-11-25
"""

import os
import time
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from PIL import Image
from dotenv import load_dotenv


class ScreenshotCapture:
    """Automated screenshot capture for PDM Loan Management System"""

    def __init__(self, config_file: str = "config.json"):
        """Initialize the screenshot capture tool"""
        load_dotenv()

        # Load configuration
        self.config = self._load_config(config_file)

        # Setup paths
        self.output_dir = Path(self.config.get("output_directory", "screenshots"))
        self.output_dir.mkdir(exist_ok=True)

        # Create timestamp-based subdirectory
        self.session_dir = self.output_dir / datetime.now().strftime("%Y%m%d_%H%M%S")
        self.session_dir.mkdir(exist_ok=True)

        # Initialize driver
        self.driver = None
        self._setup_driver()

        # Track captured screenshots
        self.captured_screenshots = []

    def _load_config(self, config_file: str) -> Dict:
        """Load configuration from JSON file"""
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                return json.load(f)
        return self._default_config()

    def _default_config(self) -> Dict:
        """Return default configuration"""
        return {
            "base_url": "http://localhost:3000",
            "backend_url": "http://localhost:8080",
            "output_directory": "screenshots",
            "window_width": 1920,
            "window_height": 1080,
            "wait_timeout": 10,
            "screenshot_delay": 2,
            "full_page_screenshot": True,
            "credentials": {
                "admin": {
                    "email": "admin@pdm.com",
                    "password": "admin123"
                },
                "banker": {
                    "email": "banker@pdm.com",
                    "password": "banker123"
                },
                "applicant": {
                    "email": "user@pdm.com",
                    "password": "user123"
                }
            },
            "routes": {
                "public": [
                    "/",
                    "/about",
                    "/contact"
                ],
                "applicant": [
                    "/dashboard",
                    "/loans/apply",
                    "/loans/calculator",
                    "/loans/my-loans",
                    "/wallet",
                    "/transactions",
                    "/messages",
                    "/notifications",
                    "/statistics",
                    "/profile/settings"
                ],
                "admin": [
                    "/admin/dashboard",
                    "/admin/users",
                    "/admin/loans",
                    "/admin/applications",
                    "/admin/transactions",
                    "/admin/support-tickets",
                    "/admin/analytics",
                    "/admin/settings"
                ],
                "banker": [
                    "/banker/dashboard",
                    "/banker/applications/review",
                    "/banker/disbursements",
                    "/banker/tasks"
                ],
                "verifier": [
                    "/verifier/dashboard",
                    "/verifier/kyc",
                    "/verifier/documents"
                ],
                "underwriter": [
                    "/underwriter/dashboard",
                    "/underwriter/risk-assessment",
                    "/underwriter/offers"
                ]
            }
        }

    def _setup_driver(self):
        """Setup Chrome WebDriver with options"""
        chrome_options = Options()

        # Headless mode (can be disabled for debugging)
        if self.config.get("headless", False):
            chrome_options.add_argument("--headless=new")

        # Additional options
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument(f"--window-size={self.config['window_width']},{self.config['window_height']}")

        # Initialize driver
        try:
            # Try to use webdriver-manager
            driver_path = ChromeDriverManager().install()
            # Fix for macOS arm64 - ChromeDriverManager returns wrong file
            if 'chromedriver-mac-arm64' in driver_path:
                # Navigate to the directory and use the actual chromedriver binary
                driver_dir = os.path.dirname(driver_path)
                actual_driver = os.path.join(driver_dir, 'chromedriver')
                if os.path.exists(actual_driver):
                    driver_path = actual_driver
                    print(f"✅ Using chromedriver at: {driver_path}")
            service = Service(driver_path)
        except Exception as e:
            print(f"Warning: ChromeDriverManager failed: {e}")
            print("Attempting to use system chromedriver...")
            # Fallback to system chromedriver
            service = Service()

        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.implicitly_wait(self.config.get("wait_timeout", 10))

    def login(self, role: str = "applicant"):
        """Login with specific role credentials"""
        credentials = self.config["credentials"].get(role)
        if not credentials:
            print(f"❌ No credentials found for role: {role}")
            return False

        try:
            # Navigate to login page
            login_url = f"{self.config['base_url']}/login"
            self.driver.get(login_url)
            time.sleep(2)

            # Try multiple selectors for email field (more robust)
            email_selectors = [
                "input[name='email']",
                "input[id='email']",
                "input[type='email']",
                "input[placeholder*='email' i]",
                "input[placeholder*='@' i]",
                "label:contains('Email') + input",
                "input:first-of-type",
            ]
            
            email_field = None
            for selector in email_selectors:
                try:
                    if ':contains(' in selector:
                        # XPath for label with text
                        email_field = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Email')]/following-sibling::input | //label[contains(text(), 'Email')]/../input")
                    else:
                        email_field = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if email_field and email_field.is_displayed():
                        break
                except NoSuchElementException:
                    continue
            
            if not email_field:
                raise Exception("Could not find email input field")

            # Try multiple selectors for password field
            password_selectors = [
                "input[name='password']",
                "input[id='password']",
                "input[type='password']",
                "input[placeholder*='password' i]",
                "label:contains('Password') + input",
                "input[type='password']:last-of-type",
            ]
            
            password_field = None
            for selector in password_selectors:
                try:
                    if ':contains(' in selector:
                        # XPath for label with text
                        password_field = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Password')]/following-sibling::input | //label[contains(text(), 'Password')]/../input")
                    else:
                        password_field = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if password_field and password_field.is_displayed():
                        break
                except NoSuchElementException:
                    continue
            
            if not password_field:
                raise Exception("Could not find password input field")

            # Fill in credentials
            email_field.clear()
            email_field.send_keys(credentials["email"])
            time.sleep(0.5)

            password_field.clear()
            password_field.send_keys(credentials["password"])
            time.sleep(0.5)

            # Try multiple selectors for submit button
            submit_selectors = [
                "button[type='submit']",
                "form button[type='submit']",
                "button:contains('Sign In')",
                "button:contains('Login')",
                "form button:not([type='button'])",
            ]
            
            submit_button = None
            for selector in submit_selectors:
                try:
                    if ':contains(' in selector:
                        # XPath for text content
                        submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In') or contains(text(), 'Login') or contains(text(), 'Sign')]")
                    else:
                        submit_button = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if submit_button and submit_button.is_displayed() and not submit_button.get_attribute('disabled'):
                        break
                except (NoSuchElementException, Exception):
                    continue
            
            if not submit_button:
                # Fallback: try to submit the form directly
                try:
                    form = self.driver.find_element(By.TAG_NAME, "form")
                    form.submit()
                except Exception as e:
                    raise Exception(f"Could not find submit button or form: {e}")
            else:
                # Scroll button into view and click
                self.driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
                time.sleep(0.5)
                submit_button.click()

            # Wait for redirect with longer timeout
            time.sleep(5)

            # Verify login was successful (check if we're redirected away from login page)
            current_url = self.driver.current_url
            if '/login' in current_url:
                # Still on login page, might have failed
                time.sleep(2)  # Give it more time
                current_url = self.driver.current_url
                if '/login' in current_url:
                    raise Exception("Login appears to have failed - still on login page")

            print(f"✅ Logged in as {role}")
            return True

        except Exception as e:
            print(f"❌ Login failed for {role}: {e}")
            return False

    def logout(self):
        """Logout from current session"""
        try:
            # Try to find logout button/link
            logout_elements = [
                (By.LINK_TEXT, "Logout"),
                (By.PARTIAL_LINK_TEXT, "Sign out"),
                (By.CSS_SELECTOR, "[data-action='logout']"),
                (By.XPATH, "//button[contains(text(), 'Logout')]")
            ]

            for by, value in logout_elements:
                try:
                    logout_btn = self.driver.find_element(by, value)
                    logout_btn.click()
                    time.sleep(2)
                    print("✅ Logged out successfully")
                    return True
                except NoSuchElementException:
                    continue

            # Alternative: Clear cookies
            self.driver.delete_all_cookies()
            print("✅ Cleared session cookies")
            return True

        except Exception as e:
            print(f"⚠️ Logout warning: {e}")
            return False

    def capture_screenshot(self, filename: str, description: str = ""):
        """Capture screenshot of current page"""
        try:
            # Wait for page to load
            time.sleep(self.config.get("screenshot_delay", 2))

            # Full page screenshot if enabled
            if self.config.get("full_page_screenshot", True):
                self._capture_full_page(filename)
            else:
                filepath = self.session_dir / f"{filename}.png"
                self.driver.save_screenshot(str(filepath))

            # Track screenshot
            self.captured_screenshots.append({
                "filename": filename,
                "description": description,
                "url": self.driver.current_url,
                "timestamp": datetime.now().isoformat()
            })

            print(f"📸 Captured: {filename}")
            return True

        except Exception as e:
            print(f"❌ Failed to capture {filename}: {e}")
            return False

    def _capture_full_page(self, filename: str):
        """Capture full page screenshot (including scrollable content)"""
        # Get page dimensions
        total_height = self.driver.execute_script("return document.body.scrollHeight")
        viewport_height = self.driver.execute_script("return window.innerHeight")

        # Calculate number of scrolls needed
        num_scrolls = (total_height // viewport_height) + 1

        screenshots = []
        for i in range(num_scrolls):
            # Scroll to position
            scroll_position = i * viewport_height
            self.driver.execute_script(f"window.scrollTo(0, {scroll_position})")
            time.sleep(0.5)

            # Capture screenshot
            temp_file = self.session_dir / f"temp_{i}.png"
            self.driver.save_screenshot(str(temp_file))
            screenshots.append(temp_file)

        # Stitch screenshots together
        if len(screenshots) > 1:
            self._stitch_screenshots(screenshots, filename)
        else:
            # Just rename if only one screenshot
            screenshots[0].rename(self.session_dir / f"{filename}.png")

        # Cleanup temp files
        for temp_file in screenshots:
            if temp_file.exists():
                temp_file.unlink()

    def _stitch_screenshots(self, screenshots: List[Path], filename: str):
        """Stitch multiple screenshots into one image"""
        images = [Image.open(str(path)) for path in screenshots]

        # Calculate total height
        widths, heights = zip(*(img.size for img in images))
        total_height = sum(heights)
        max_width = max(widths)

        # Create new image
        stitched_image = Image.new('RGB', (max_width, total_height))

        # Paste images
        y_offset = 0
        for img in images:
            stitched_image.paste(img, (0, y_offset))
            y_offset += img.height

        # Save
        output_path = self.session_dir / f"{filename}.png"
        stitched_image.save(str(output_path))

    def capture_route(self, route: str, name: str, description: str = ""):
        """Navigate to route and capture screenshot"""
        try:
            url = f"{self.config['base_url']}{route}"
            self.driver.get(url)

            # Wait for page load
            WebDriverWait(self.driver, self.config["wait_timeout"]).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )

            self.capture_screenshot(name, description)
            return True

        except Exception as e:
            print(f"❌ Failed to capture route {route}: {e}")
            return False

    def capture_all_routes(self, role: str = None):
        """Capture screenshots of all routes for a specific role"""
        if role:
            # Login as specific role
            if role != "public":
                if not self.login(role):
                    return

            # Capture routes for this role
            routes = self.config["routes"].get(role, [])
            for route in routes:
                route_name = f"{role}_{route.replace('/', '_').strip('_')}"
                self.capture_route(route, route_name, f"{role.title()} - {route}")

            # Logout if not public
            if role != "public":
                self.logout()
        else:
            # Capture all routes for all roles
            for role_name in self.config["routes"].keys():
                print(f"\n📂 Capturing {role_name.upper()} screens...")
                self.capture_all_routes(role_name)

    def generate_report(self):
        """Generate HTML report of captured screenshots"""
        report_path = self.session_dir / "report.html"

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDM Screenshot Report - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        h1 {{
            color: #333;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 10px;
        }}
        .screenshot {{
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .screenshot h2 {{
            color: #555;
            margin-top: 0;
        }}
        .screenshot img {{
            max-width: 100%;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 10px;
        }}
        .meta {{
            color: #777;
            font-size: 14px;
            margin: 10px 0;
        }}
        .summary {{
            background: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }}
    </style>
</head>
<body>
    <h1>📸 PDM Loan Management System - Screenshot Report</h1>

    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Session:</strong> {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
        <p><strong>Total Screenshots:</strong> {len(self.captured_screenshots)}</p>
        <p><strong>Output Directory:</strong> {self.session_dir}</p>
    </div>
"""

        for screenshot in self.captured_screenshots:
            html_content += f"""
    <div class="screenshot">
        <h2>{screenshot['filename']}</h2>
        <p class="meta">
            <strong>Description:</strong> {screenshot.get('description', 'N/A')}<br>
            <strong>URL:</strong> {screenshot['url']}<br>
            <strong>Captured:</strong> {screenshot['timestamp']}
        </p>
        <img src="{screenshot['filename']}.png" alt="{screenshot['filename']}">
    </div>
"""

        html_content += """
</body>
</html>
"""

        with open(report_path, 'w') as f:
            f.write(html_content)

        print(f"\n✅ Report generated: {report_path}")

    def close(self):
        """Close the browser and cleanup"""
        if self.driver:
            self.driver.quit()
            print("\n✅ Browser closed")


def main():
    """Main execution function"""
    print("=" * 60)
    print("PDM Loan Management System - Screenshot Capture Tool")
    print("=" * 60)

    # Initialize capture tool
    capture = ScreenshotCapture()

    try:
        # Capture screenshots for all roles
        capture.capture_all_routes()

        # Generate HTML report
        capture.generate_report()

        print("\n" + "=" * 60)
        print(f"✅ All screenshots captured successfully!")
        print(f"📁 Output directory: {capture.session_dir}")
        print("=" * 60)

    except KeyboardInterrupt:
        print("\n\n⚠️ Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        capture.close()


if __name__ == "__main__":
    main()
