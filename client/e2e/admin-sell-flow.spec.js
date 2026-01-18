import { test, expect } from '@playwright/test';

test.describe('Admin Sell Requests Flow', () => {

    test('User sells device -> Admin updates offer', async ({ page }) => {
        // --- 1. User Submission ---
        await page.goto('/saelg-enhed');

        // Select Brand (Assuming Apple exists as seeded)
        await page.locator('text=Apple').first().click();

        // Select Model (Assuming iPhone 11 or similar exists)
        // We'll click the first model button available
        await page.locator('button:has-text("iPhone")').first().click();

        // Select Capacity & Color
        await page.click('text=64GB');
        await page.click('text=BLACK');
        await page.click('button:has-text("Næste")');

        // Select Condition
        await page.click('text=Som ny');
        await page.click('button:has-text("Se Tilbud")');

        // Check Estimate shown
        await expect(page.getByText(/DKK \d+/)).toBeVisible();

        // Fill Contact Form
        await page.fill('input[placeholder="Navn"]', 'Test Seller');
        await page.fill('input[placeholder="Email"]', 'seller@example.com');
        await page.fill('input[placeholder="Telefon"]', '12345678');

        await page.click('button:has-text("Indsend: Næste")', { force: true });

        // Verify Success
        await expect(page.locator('text=Tak for din henvendelse!')).toBeVisible();


        // --- 2. Admin Processing ---
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Navigate to dashboard
        await expect(page).toHaveURL(/\/admin/);

        // Click "Manage Buybacks"
        await page.click('text=Manage Buybacks');
        await expect(page).toHaveURL(/\/admin\/sell-requests/);

        // Find the request (Test Seller)
        await expect(page.locator('text=Test Seller').first()).toBeVisible();
        await expect(page.locator('text=Som ny').first()).toBeVisible();

        // Click Edit (first edit button)
        // Click Edit (first edit button)
        await page.getByLabel('Edit').first().click();

        // Update Status and Price
        await page.selectOption('select', 'Completed');
        await page.locator('input[type="number"]').fill('1500'); // Final Price
        await page.fill('textarea', 'Verified device condition. Good to go.');

        await page.click('button:has-text("Save Changes")');

        // Verify updates in table
        await expect(page.locator('span:has-text("Completed")').first()).toBeVisible();
        await expect(page.locator('text=1500 DKK').first()).toBeVisible();
    });

    test('User sells screen -> Admin updates request', async ({ page }) => {
        // --- 1. User Submission ---
        await page.goto('/saelg-skaerm');

        await page.fill('textarea[name="description"]', '5x Broken iPhone 12 Screens');
        await page.fill('input[name="quantity"]', '5');
        await page.fill('input[name="customerName"]', 'Screen Seller');
        await page.fill('input[name="customerEmail"]', 'screens@example.com');
        await page.fill('input[name="customerPhone"]', '87654321');

        await page.click('button:has-text("Send Forespørgsel")');

        await expect(page.locator('text=Tak for din henvendelse!')).toBeVisible();

        // --- 2. Admin Processing ---
        // (Assuming session persists or re-login if needed, serial mode might be safer or separate login path)
        // We'll just re-navigate as admin if cookie set, or login again
        await page.goto('/admin');
        if (await page.locator('input[type="email"]').isVisible()) {
            await page.fill('input[type="email"]', 'admin@example.com');
            await page.fill('input[type="password"]', 'admin123');
            await page.click('button[type="submit"]');
        }

        await page.click('text=Screen Requests');
        await expect(page).toHaveURL(/\/admin\/screen-requests/);

        await expect(page.locator('text=Screen Seller').first()).toBeVisible();
        await expect(page.locator('text=5x Broken iPhone 12 Screens').first()).toBeVisible();

        // Click Edit (first edit button)
        await page.getByLabel('Edit').first().click();

        await page.selectOption('select', 'Inspection');
        await page.locator('input[type="number"]').fill('500');
        await page.fill('textarea', 'Screens received, testing now.');

        await page.click('button:has-text("Save Changes")');

        await expect(page.locator('span:has-text("Inspection")').first()).toBeVisible();
        await expect(page.locator('text=500 DKK').first()).toBeVisible();
    });

});
