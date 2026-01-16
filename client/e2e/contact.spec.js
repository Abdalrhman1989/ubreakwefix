import { test, expect } from '@playwright/test';

test.describe('Contact Page Functionality', () => {

    test('Contact Form Submission', async ({ page }) => {
        // 1. Navigate to Contact Page
        await page.goto('/kontakt');
        await expect(page.locator('h1')).toContainText('Kontakt Os'); // Verify Header

        // 2. Fill Contact Form
        await page.locator('input[name="name"]').fill('Test User');
        await page.locator('input[name="email"]').fill('test@example.com');
        await page.locator('input[name="subject"]').fill('E2E Test Subject');
        await page.locator('textarea[name="message"]').fill('This is a test message from Playwright.');

        // 3. Submit Form
        await page.locator('button[type="submit"]').click();

        // 4. Verify Success Message (Wait for it to appear)
        // Check for "Besked Sendt!" or English equivalent depending on default lang
        // Assuming default is DA or we should switch to DA to be sure, or check for partial text
        await expect(page.locator('body')).toContainText('Besked Sendt!', { timeout: 10000 });
    });

    test('Booking Tab Navigation and Load', async ({ page }) => {
        // 1. Navigate to Contact Page
        await page.goto('/kontakt');

        // 2. Switch to "Book Tid" (Book Appointment) tab
        const bookTab = page.locator('button', { hasText: 'Book Tid' }).or(page.locator('button', { hasText: 'Book Appointment' }));
        await bookTab.click();

        // 3. Verify Scheduler Component Loads
        // Look for typical scheduler elements like "Vælg dato" or "Select Date"
        await expect(page.locator('body')).toContainText(/Vælg.*dato|Select.*Date/i);
    });

});
