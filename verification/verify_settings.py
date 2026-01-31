from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to settings
        page.goto("http://localhost:5173/settings")

        # Click on AI Model tab
        ai_tab = page.get_by_role("tab", name="AI Model")
        ai_tab.click()

        # Wait for content
        expect(page.get_by_text("Quick Setup")).to_be_visible()

        # Scroll to bottom to ensure buttons are visible
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

        # Take full page screenshot
        page.screenshot(path="verification/settings_ai_tab_full.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
