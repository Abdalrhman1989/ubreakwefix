import { test, expect } from '@playwright/test';

test.describe('Admin Pricing Engine Flow', () => {

    test('Admin sets buyback price -> User sees correct offer', async ({ page }) => {
        // --- 1. Login as Admin ---
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // --- 2. Create Model (without price) ---
        await page.click('text=Models'); // Navigate to Models
        await page.click('button:has-text("Add Model")');

        const modelName = 'Test Pricing Phone ' + Date.now();
        await page.selectOption('select', { label: 'Apple' });
        await page.fill('input[placeholder="e.g. iPhone 15 Pro"]', modelName);
        // Note: No price input here anymore
        await page.click('button:has-text("Create Model")');

        // Verify model created in list
        await expect(page.locator(`text=${modelName}`).first()).toBeVisible();

        // --- 3. Go to Pricing Engine ---
        await page.click('text=Pricing Engine'); // New sidebar link or from Dashboard

        // Select Brand
        await page.selectOption('select', { label: 'Apple' });

        // Search and Select Model
        await page.fill('input[placeholder="Search models..."]', modelName);
        await page.click(`button:has-text("${modelName}")`);

        // --- 4. Add Storage & Set Price ---
        // Add "128GB" if not present (it won't be for new model)
        await page.fill('input[placeholder*="Add Storage"]', '128GB');
        await page.click('button:has(.lucide-plus)'); // The add plus button

        // Wait for matrix table row "128GB"
        const row = page.locator('tr:has-text("128GB")');
        await expect(row).toBeVisible();

        // Set Price for "Som ny" (Assuming it's the first input column)
        // Or we can just set ALL inputs in that row to 5100 to be safe
        const inputs = row.locator('input[type="number"]');
        await inputs.first().fill('5100'); // "Som ny" is usually first

        await page.click('button:has-text("Save Prices")');

        // Handle alert
        page.on('dialog', dialog => dialog.accept());

        // --- 5. User Verification ---
        await page.goto('/saelg-enhed');

        // Select Apple
        await page.locator('button:has-text("Apple")').first().click();

        // Select our new model
        await page.locator(`button:has-text("${modelName}")`).first().click();

        // Select Capacity "128GB"
        await page.click('text=128GB');

        // Select Color (Any)
        await page.click('text=BLACK');
        await page.click('button:has-text("Næste")');

        // Select Condition "Som ny" (Multiplier 1.0)
        await page.click('text=Som ny');
        await page.click('button:has-text("Se Tilbud")');

        // Expected Price: 5100
        await expect(page.locator('text=DKK 5100')).toBeVisible();

        // --- Cleanup (Optional) ---
        // Could delete model via API or UI to keep DB clean
    });

});
