import { test, expect } from '@playwright/test';

test.describe('Business User Flow', () => {
    const uniqueId = Date.now();
    const businessEmail = `biz${uniqueId}@example.com`;
    const businessName = `Business ${uniqueId}`;
    const cvr = '12345678';

    test('Business Signup and Dashboard Access', async ({ page }) => {
        // 1. Navigate to Business Signup
        await page.goto('/erhverv/opret');
        await expect(page.getByRole('heading', { name: /Opret Erhvervskonto/i })).toBeVisible();

        // 2. Fill Form
        // Assuming fields based on BusinessSignup.jsx (need to verify exact names if it fails)
        // Guessed names: companyName, cvr, email, phone, address, password, correct?
        // Let's inspect BusinessSignup.jsx content or assume standard names first.
        // If we fail, we'll debug.

        // Based on typical patterns:
        await page.locator('input[name="companyName"]').fill(businessName);
        await page.locator('input[name="cvr"]').fill(cvr);
        await page.locator('input[name="email"]').fill(businessEmail);
        await page.locator('input[name="phone"]').fill('87654321');
        await page.locator('input[name="address"]').fill('Business Park 1');
        // No password fields in BusinessSignup.jsx

        // 3. Submit
        await page.getByRole('button', { name: /Send Ansøgning/i }).click();

        // 4. Verify Success Message (No redirect to dashboard immediately)
        await expect(page.getByRole('heading', { name: /Ansøgning Modtaget/i })).toBeVisible();
    });
});
