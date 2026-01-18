import { test, expect } from '@playwright/test';

test.describe.serial('Admin Users Management', () => {
    const timestamp = Date.now();
    const userName = `TestUser ${timestamp}`;
    const userEmail = `user${timestamp}@test.com`;
    const userPassword = 'password123';

    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/admin/);

        await page.goto('/admin/users');
    });

    test('Create and Delete User', async ({ page }) => {
        // 1. Create User
        await page.click('button:has-text("Add User")');

        await page.fill('div.card-glass input[type="text"]', userName); // First type=text is name based on code
        // Or better: locate logic
        // The labels are sibling to inputs or wrapping.
        // Code: label -> input. 
        // We can use placeholders if available? No placeholders in code. 
        // We can use layout order: 
        // 1. Name, 2. Email, 3. Password.

        // Let's use getByLabel if possible, but the label is separate element.
        // Let's use :below() locator or verify order.
        // Or CSS selectors based on the grid.

        // Inspecting AdminUsers.jsx:
        // Inputs are just <input>.
        // 1st input: Name
        // 2nd input: Email
        // 3rd input: Password
        // 4th input: Phone
        // Select: Role

        const inputs = page.locator('div.card-glass input');
        await inputs.nth(0).fill(userName);
        await inputs.nth(1).fill(userEmail);
        await inputs.nth(2).fill(userPassword);

        const phoneInput = inputs.nth(3);
        await phoneInput.fill('12345678');

        await page.locator('div.card-glass select').selectOption({ value: 'user' });

        await page.click('button:has-text("Create User")');

        // Verify creation
        await expect(page.locator(`tr:has-text("${userEmail}")`)).toBeVisible();
        await expect(page.locator(`tr:has-text("${userName}")`)).toBeVisible();

        // 2. Delete User
        page.on('dialog', dialog => dialog.accept());

        // Find row with email
        const row = page.locator(`tr:has-text("${userEmail}")`);
        await row.locator('button[title="Delete User"]').click();

        // Verify deletion
        await expect(page.locator(`tr:has-text("${userEmail}")`)).not.toBeVisible();
    });
});
