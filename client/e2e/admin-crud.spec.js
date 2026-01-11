import { test, expect } from '@playwright/test';

test.describe.serial('Admin CRUD Operations', () => {
    // Shared Data
    const timestamp = Date.now();
    const brandName = `Brand ${timestamp}`;
    const modelName = `Model ${timestamp}`;
    const repairName = `Repair ${timestamp}`;
    const categoryName = `Category ${timestamp}`;
    let usedFamily = 'Other';

    test.beforeAll(async ({ browser }) => {
        // Optional: Can setup context here if needed
    });

    test('Full Admin CRUD Lifecycle', async ({ page }) => {
        // Handle Alerts
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });

        // --- 0. Login ---
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

        // --- 1. Manage Brands ---
        console.log('--- Step 1: Create Brand ---');
        await page.goto('/admin/brands', { waitUntil: 'networkidle' });
        await page.click('button:has-text("Add Brand")');
        await page.fill('input[placeholder="e.g. Apple"]', brandName);
        await page.fill('input[placeholder="https://..."]', 'https://placehold.co/100');
        await page.click('button:has-text("Create Brand")');
        await expect(page.locator(`tr:has-text("${brandName}")`)).toBeVisible();

        // --- 2. Manage Models ---
        console.log('--- Step 2: Create Model ---');
        await page.goto('/admin/models', { waitUntil: 'networkidle' });
        // Wait for fetch
        await page.waitForTimeout(1000);

        await page.click('button:has-text("Add Model")');

        // Use known brand "Apple" if available for robustness
        const brandSelect = page.locator('select').first();
        const options = await brandSelect.textContent();

        let selectedBrandLabel = brandName;
        if (options.includes('Apple')) {
            console.log('Using Apple for Model creation robustness');
            selectedBrandLabel = 'Apple';
            await brandSelect.selectOption({ label: 'Apple' });
        } else {
            console.log('Using created brand for Model creation');
            await expect(brandSelect).toContainText(brandName);
            await brandSelect.selectOption({ label: brandName });
        }

        await page.fill('input[placeholder="e.g. iPhone 15 Pro"]', modelName);

        // Always try to select 'Other' to be consistent
        try {
            await page.locator('select').nth(1).selectOption('Other');
            usedFamily = 'Other';
        } catch (e) {
            // If Other not found, select index 1 (usually first family)
            console.log('Other family not found, selecting index 1');
            await page.locator('select').nth(1).selectOption({ index: 1 });
            // We need to know what we selected? Hard to know without reading. 
            // Let's assume Other is there as per code inspection.
        }

        await page.click('button:has-text("Create Model")');

        // Reload to ensure list is fresh
        await page.reload({ waitUntil: 'networkidle' });

        try {
            await expect(page.locator(`tr:has-text("${modelName}")`)).toBeVisible({ timeout: 5000 });
        } catch (e) {
            console.log('--- Model Table Contents ---');
            const rows = await page.locator('tr').allInnerTexts();
            rows.forEach(r => console.log(r));
            throw e;
        }

        // --- 3. Manage Repairs ---
        console.log('--- Step 3: Create Repair ---');
        await page.goto('/admin/repairs', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Select Brand
        const repairBrandSelect = page.locator('select').first();
        await expect(repairBrandSelect).toContainText(selectedBrandLabel);
        await repairBrandSelect.selectOption({ label: selectedBrandLabel });

        // Select Series (Family)
        await expect(page.locator('select').nth(1)).toBeEnabled();

        // We used 'Other' (or attempted to). 
        // If the dropdown has 'Other', select it.
        const seriesText = await page.locator('select').nth(1).textContent();
        if (seriesText.includes('Other')) {
            await page.locator('select').nth(1).selectOption('Other');
        } else {
            // If we couldn't select Other before, maybe we selected something else.
            // Just match whatever validation rules exist.
            // Since we control creation, Other should be there if we created it successfully.
            await page.locator('select').nth(1).selectOption({ index: 1 });
        }

        // Select Model
        await expect(page.locator('select').nth(2)).toContainText(modelName);
        await page.locator('select').nth(2).selectOption({ label: modelName });

        await expect(page.locator('button:has-text("Add Repair")')).toBeEnabled();
        await page.click('button:has-text("Add Repair")');

        await page.fill('input[placeholder="e.g. Screen Replacement"]', repairName);
        await page.fill('input[type="number"]', '500');
        await page.fill('input[value*="min"]', '45 min');
        await page.click('button:has-text("Create Repair")');

        await expect(page.locator(`tr:has-text("${repairName}")`)).toBeVisible();

        // --- 4. Manage Categories ---
        console.log('--- Step 4: Create Category ---');
        await page.goto('/admin/categories', { waitUntil: 'networkidle' });
        await page.click('button:has-text("Add Category")');
        await page.fill('input[type="text"]:visible', categoryName);
        await page.click('button:has-text("Save Category")');
        await expect(page.locator(`td:has-text("${categoryName}")`)).toBeVisible();
    });
});
