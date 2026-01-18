import { test, expect } from '@playwright/test';

test.describe.serial('Business Application Flow', () => {
    const uniqueId = Date.now();
    const businessName = `Biz Corp ${uniqueId}`;
    const cvr = `123${uniqueId.toString().slice(-5)}`; // Random CVR
    const email = `biz${uniqueId}@test.com`;

    test('User applies and Admin approves', async ({ page }) => {
        // 1. User Applies
        await page.goto('/erhverv/opret');
        await page.fill('input[name="companyName"]', businessName);
        await page.fill('input[name="cvr"]', cvr);
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="phone"]', '12345678');
        await page.fill('input[name="address"]', 'Test Address 1');

        // Find Submit Button - "Send Ansøgning"
        await page.click('button:has-text("Send Ansøgning")');

        // Verify Success "Ansøgning Modtaget"
        await expect(page.locator('h1').filter({ hasText: /Ansøgning Modtaget/i })).toBeVisible();

        // 2. Admin Approves
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');

        await page.goto('/admin/business-requests');

        // Find row
        await page.reload();
        const row = page.locator(`tr:has-text("${businessName}")`);
        await expect(row).toBeVisible();

        // Click Approve (Green check)
        // Button with title "Approve" (from my inspection of AdminBusinessRequests.jsx)
        page.on('dialog', dialog => dialog.accept());
        await row.locator('button[title="Approve"]').click();

        // Verify Status Change
        // It should disappear or change status. Use reload to be sure.
        await page.waitForTimeout(1000);
        await page.reload();

        const updatedRow = page.locator(`tr:has-text("${businessName}")`);

        await expect(updatedRow).toContainText('approved', { ignoreCase: true });

        await expect(updatedRow.locator('button[title="Approve"]')).not.toBeVisible();
    });
});
