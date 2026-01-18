import { test, expect } from '@playwright/test';

test.describe.serial('Admin Products Management', () => {
    const timestamp = Date.now();
    const productName = `Test Product ${timestamp}`;
    const updatedPrice = '999';

    test.beforeEach(async ({ page }) => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/admin/);
        await page.goto('/admin/products');
    });

    test('Full Product Lifecycle', async ({ page }) => {
        // 1. Create
        await page.click('a:has-text("Add Product")');
        await page.fill('input[name="name"]', productName);
        await page.fill('input[name="price"]', '500');
        await page.locator('select[name="category_id"]').selectOption({ index: 1 });
        await page.fill('input[name="stock_quantity"]', '10');
        await page.click('button:has-text("Save Product")');

        await expect(page).toHaveURL(/\/admin\/products/);
        await page.waitForTimeout(1000);

        // 2. Edit
        const productRow = page.locator('tr').filter({ hasText: productName }).first();
        await expect(productRow).toBeVisible();

        await productRow.locator('button').first().click();
        await expect(page.locator('h1')).toContainText('Edit Product', { timeout: 10000 });

        // DEBUG: Verify input update
        await page.fill('input[name="price"]', updatedPrice);
        // Ensure field was filled
        await expect(page.locator('input[name="price"]')).toHaveValue(updatedPrice);

        await page.getByTestId('admin-save-product-btn').click();

        await expect(page).toHaveURL(/\/admin\/products/);

        // Force Refresh
        await page.goto('/admin');
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Verify Update
        const updatedRow = page.locator('tr').filter({ hasText: productName }).first();
        await expect(updatedRow).toBeVisible();

        // BUG: Price update is not persisting in backend logic (remains 500).
        // Using soft assertion to report it but verify Delete flow.
        await expect.soft(updatedRow).toContainText(updatedPrice);

        // 3. Delete
        page.on('dialog', dialog => dialog.accept());
        await updatedRow.locator('button').nth(1).click();

        await page.waitForTimeout(1000);
        await page.reload();
        await expect(page.locator('tr').filter({ hasText: productName })).not.toBeVisible();
    });
});
