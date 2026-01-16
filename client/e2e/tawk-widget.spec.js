import { test, expect } from '@playwright/test';

test('Tawk.to widget script is injected', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');

    // 2. Check for the script tag
    // The src contains the property ID we used
    const script = page.locator('script[src*="embed.tawk.to"]');
    await expect(script).toHaveCount(1);

    // 3. Check specific ID for default language (DA) -> 1hnk825uo
    const src1 = await script.getAttribute('src');
    expect(src1).toContain('1hnk825uo');

    console.log('Default Language Widget Verified');

    // 4. Switch Language (Click the flag/toggle)
    // Find button that toggles language. In Navbar checking for the flag emoji
    await page.click('button[title="Switch Language"]');

    // 5. Verify the script changed to English ID -> 1hnmvcria
    // Note: Our implementation removes the old script and adds a new one.
    // Wait a bit for effect
    await page.waitForTimeout(1000);

    // Re-query locator
    // Re-query locator for the English ID
    const script2 = page.locator('script[src*="1hnmvcria"]');
    // We expect at least 1, but maybe Tawk keeps old ones or splits them?
    // Let's just check if it exists.
    await expect(script2).toBeVisible({ visible: false, timeout: 5000 }); // script tags are not visible but exist in DOM
    // Better: count > 0
    const count = await script2.count();
    expect(count).toBeGreaterThan(0);

    const src2 = await script2.getAttribute('src');
    expect(src2).toContain('1hnmvcria');

    console.log('English Language Widget Verified');
});
