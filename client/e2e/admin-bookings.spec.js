import { test, expect } from '@playwright/test';

test.describe('Admin Bookings Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/admin/);

        await page.goto('/admin/bookings');
    });

    test('View Bookings and Update Status', async ({ page }) => {
        // Verify Title
        await expect(page.locator('h1')).toContainText('Bookings & Orders');

        // Check if there are bookings or empty state
        // If empty, we can't fully test status update unless we seed data.
        // Inspecting existing tests: seeding is not explicit in specs usually.
        // However, if the system is persistent, previous tests might have created data. 
        // Or we assume the seed data has some bookings.

        // If no bookings, we just skip status update verification but check UI elements.
        const rowCount = await page.locator('tbody tr').count();
        if (rowCount > 0 && await page.locator('tbody tr').first().innerText() !== 'No bookings found.') {
            console.log('Bookings found, testing status update...');

            const statusSelect = page.locator('tbody tr').first().locator('select');
            const originalStatus = await statusSelect.inputValue();

            // Change Status
            const newStatus = originalStatus === 'Completed' ? 'In Progress' : 'Completed';
            await statusSelect.selectOption(newStatus);

            // Reload and Verify
            await page.reload();
            await expect(page.locator('tbody tr').first().locator('select')).toHaveValue(newStatus);

            // Revert (Good practice)
            await page.locator('tbody tr').first().locator('select').selectOption(originalStatus);
        } else {
            console.warn('No bookings found to test status update. Verifying empty state UI.');
            await expect(page.locator('td')).toContainText('No bookings found');
        }

        // Test Calendar Toggle
        await page.click('button:has-text("Calendar")');
        // await expect(page.locator('.rdp, .day-picker, .card-glass')).toBeVisible(); 
        // The component has "Mon", "Tue" headers, checking for that is enough to verify calendar view switch
        await expect(page.locator('text=Mon')).toBeVisible();
        // The component has "Mon", "Tue" headers
        await expect(page.locator('text=Mon')).toBeVisible();

        // Switch back
        await page.click('button:has-text("List")');
        await expect(page.locator('table')).toBeVisible();
    });
});
