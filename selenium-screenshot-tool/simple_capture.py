#!/usr/bin/env python3
"""Simple screenshot capture with proper form login"""

import os
import time
from pathlib import Path
from datetime import datetime

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

# Configuration
BASE_URL = "http://localhost:4000"
OUTPUT_DIR = Path("screenshots") / datetime.now().strftime("%Y%m%d_%H%M%S")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Credentials
APPLICANT_CREDS = {"email": "test@test.com", "password": "TestPassword@123"}
STAFF_CREDS = {"email": "banker@olavs.com", "password": "TestPassword@123"}
ADMIN_CREDS = {"email": "admin@olavs.com", "password": "TestPassword@123"}


def setup_driver():
    """Setup Chrome WebDriver"""
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    try:
        driver_path = ChromeDriverManager().install()
        if 'chromedriver-mac-arm64' in driver_path:
            driver_dir = os.path.dirname(driver_path)
            actual_driver = os.path.join(driver_dir, 'chromedriver')
            if os.path.exists(actual_driver):
                driver_path = actual_driver
        service = Service(driver_path)
    except Exception as e:
        print(f"Warning: {e}")
        service = Service()

    return webdriver.Chrome(service=service, options=chrome_options)


def capture(driver, name):
    """Capture screenshot"""
    time.sleep(2)
    filepath = OUTPUT_DIR / f"{name}.png"
    driver.save_screenshot(str(filepath))
    print(f"📸 Captured: {name}.png")


def login_user(driver, email, password):
    """Login as applicant via /login page using native value setter for React"""
    driver.get(f"{BASE_URL}/login")
    time.sleep(3)

    try:
        # Use native value setter to properly trigger React's onChange
        driver.execute_script("""
            function setNativeValue(element, value) {
                const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
                const prototype = Object.getPrototypeOf(element);
                const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

                if (valueSetter && valueSetter !== prototypeValueSetter) {
                    prototypeValueSetter.call(element, value);
                } else if (valueSetter) {
                    valueSetter.call(element, value);
                } else {
                    element.value = value;
                }
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }

            const emailInput = document.querySelector('input[type="email"], input[name="email"], input#email');
            const passwordInput = document.querySelector('input[type="password"], input[name="password"], input#password');

            if (emailInput) setNativeValue(emailInput, arguments[0]);
            if (passwordInput) setNativeValue(passwordInput, arguments[1]);
        """, email, password)

        time.sleep(1)

        # Click submit button
        submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].click();", submit_btn)

        # Wait for redirect
        time.sleep(6)

        current_url = driver.current_url
        if '/login' not in current_url:
            print(f"✅ User login successful - redirected to: {current_url}")
            return True
        else:
            # Check for any error messages
            try:
                error = driver.find_element(By.CSS_SELECTOR, "[class*='error'], [class*='alert']")
                print(f"❌ User login failed - error: {error.text[:100]}")
            except:
                print(f"❌ User login failed - still on login page (no error visible)")
            return False

    except Exception as e:
        print(f"❌ User login error: {e}")
        return False


def login_staff(driver, email, password):
    """Login as staff via /staff/login page"""
    driver.get(f"{BASE_URL}/staff/login")
    time.sleep(2)

    try:
        # Staff login uses plain inputs
        inputs = driver.find_elements(By.TAG_NAME, "input")
        if len(inputs) >= 2:
            inputs[0].clear()
            inputs[0].send_keys(email)
            time.sleep(0.3)
            inputs[1].clear()
            inputs[1].send_keys(password)
            time.sleep(0.3)

        # Find submit button
        submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_btn.click()

        time.sleep(5)

        current_url = driver.current_url
        if '/staff/login' not in current_url and '/login' not in current_url:
            print(f"✅ Staff login successful - redirected to: {current_url}")
            return True
        else:
            print(f"❌ Staff login failed - still on login page")
            return False

    except Exception as e:
        print(f"❌ Staff login error: {e}")
        return False


def main():
    print("=" * 60)
    print("PDM Screenshot Capture Tool")
    print("=" * 60)

    driver = setup_driver()

    try:
        # ===== PUBLIC PAGES =====
        print("\n📂 Capturing PUBLIC pages...")

        driver.get(f"{BASE_URL}/")
        capture(driver, "public_landing")

        driver.get(f"{BASE_URL}/about")
        capture(driver, "public_about")

        driver.get(f"{BASE_URL}/contact")
        capture(driver, "public_contact")

        driver.get(f"{BASE_URL}/login")
        capture(driver, "public_login")

        driver.get(f"{BASE_URL}/register")
        capture(driver, "public_register")

        driver.get(f"{BASE_URL}/staff/login")
        capture(driver, "public_staff_login")

        # ===== USER (APPLICANT) PAGES =====
        print("\n📂 Capturing USER/APPLICANT pages...")

        if login_user(driver, APPLICANT_CREDS["email"], APPLICANT_CREDS["password"]):
            # Get user ID from URL
            current = driver.current_url
            time.sleep(2)
            capture(driver, "user_dashboard")

            # Extract user ID from URL (e.g., /user/1/dashboard)
            parts = current.split('/')
            user_id = "1"
            for i, p in enumerate(parts):
                if p == "user" and i + 1 < len(parts):
                    user_id = parts[i + 1]
                    break

            driver.get(f"{BASE_URL}/user/{user_id}/applications")
            time.sleep(3)
            capture(driver, "user_applications")

            driver.get(f"{BASE_URL}/user/{user_id}/applications/new")
            time.sleep(3)
            capture(driver, "user_new_application")

            driver.get(f"{BASE_URL}/user/{user_id}/loans")
            time.sleep(3)
            capture(driver, "user_loans")

            driver.get(f"{BASE_URL}/user/{user_id}/wallet")
            time.sleep(3)
            capture(driver, "user_wallet")

            driver.get(f"{BASE_URL}/user/{user_id}/transactions")
            time.sleep(3)
            capture(driver, "user_transactions")

            driver.get(f"{BASE_URL}/user/{user_id}/messages")
            time.sleep(3)
            capture(driver, "user_messages")

            driver.get(f"{BASE_URL}/user/{user_id}/notifications")
            time.sleep(3)
            capture(driver, "user_notifications")

            driver.get(f"{BASE_URL}/user/{user_id}/support")
            time.sleep(3)
            capture(driver, "user_support")

            # Logout
            driver.delete_all_cookies()

        # ===== STAFF (BANKER) PAGES =====
        print("\n📂 Capturing STAFF/BANKER pages...")

        if login_staff(driver, STAFF_CREDS["email"], STAFF_CREDS["password"]):
            time.sleep(2)
            capture(driver, "banker_dashboard")

            current = driver.current_url
            # Extract staff ID from URL (e.g., /staff/banker/3)
            parts = current.split('/')
            staff_id = "3"
            staff_type = "banker"
            for i, p in enumerate(parts):
                if p == "staff" and i + 2 < len(parts):
                    staff_type = parts[i + 1]
                    staff_id = parts[i + 2]
                    break

            driver.get(f"{BASE_URL}/staff/{staff_type}/{staff_id}/applications")
            time.sleep(3)
            capture(driver, "banker_applications")

            driver.get(f"{BASE_URL}/staff/{staff_type}/{staff_id}/repayments")
            time.sleep(3)
            capture(driver, "banker_repayments")

            # Logout
            driver.delete_all_cookies()

        # ===== ADMIN PAGES =====
        print("\n📂 Capturing ADMIN pages...")

        if login_staff(driver, ADMIN_CREDS["email"], ADMIN_CREDS["password"]):
            time.sleep(2)
            capture(driver, "admin_dashboard")

            # Logout
            driver.delete_all_cookies()

        print(f"\n✅ Screenshots saved to: {OUTPUT_DIR}")

    finally:
        driver.quit()
        print("✅ Browser closed")


if __name__ == "__main__":
    main()
