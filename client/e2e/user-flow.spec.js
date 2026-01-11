import { test, expect } from '@playwright/test';

test.describe('Normal User Flow', () => {
    // Use a unique email slightly each time or handle cleanup?
    // Playwright tests run in parallel/isolation usually, but database persists if using mockDb.js
    // We'll use a random email to avoid collision if database isn't reset.
    const uniqueId = Date.now();
    const userEmail = `user${uniqueId}@example.com`;
    const userName = `User ${uniqueId}`;

    test('Register, Login, and View Profile', async ({ page }) => {
        // 1. Register
        await page.goto('/register');
        await page.locator('input[name="name"]').fill(userName);
        await page.locator('input[name="email"]').fill(userEmail);
        await page.locator('input[name="phone"]').fill('12345678');
        await page.locator('input[name="address"]').fill('Test Address 1');
        await page.locator('input[name="password"]').fill('password123');
        await page.locator('input[name="confirmPassword"]').fill('password123');

        // Select register button (robust selector)
        await page.getByRole('button', { name: /Opret|Register/i }).click();

        // 2. Expect Redirect to Login
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

        // 3. Login
        await page.locator('input[name="email"]').fill(userEmail);
        await page.locator('input[name="password"]').fill('password123');
        await page.getByRole('button', { name: /Log ind|Login/i }).click();

        // 4. Verify Profile Access
        // Should be redirected to /profile or /home? Login.jsx suggests /profile for normal user.
        await expect(page).toHaveURL(/\/profile/, { timeout: 10000 });
        const nameVisible = page.getByText(userName).first();
        await expect(nameVisible).toBeVisible(); // Name should appear in profile

        // Ensure Auth Context is ready by checking Navbar (if it shows name)
        // or just wait a bit.

        // 5. Navigate to Booking
        await page.goto('/book');
        await expect(page.getByRole('heading', { name: /Book Reparation/i })).toBeVisible();

        // 6. Fill Booking Form
        // We will just fill it to be robust. Pre-fill is nice but E2E should focus on successful booking.
        await page.locator('input[name="customerName"]').fill(userName);
        await page.locator('input[name="customerEmail"]').fill(userEmail);
        await page.locator('input[name="customerPhone"]').fill('12345678');

        await page.locator('input[name="deviceModel"]').fill('iPhone 14 Pro');
        await page.locator('textarea[name="problem"]').fill('Broken screen E2E Test');
        await page.locator('input[name="date"]').fill(new Date().toISOString().split('T')[0]); // Today

        // 7. Submit
        await page.getByRole('button', { name: /Bekræft Booking/i }).click();

        // 8. Verify Success
        // 8. Verify Success (Redirects to Profile)
        await expect(page).toHaveURL(/\/profile/, { timeout: 10000 });

        // 9. Redirects to profile
        // await expect(page).toHaveURL(/\/profile/, { timeout: 5000 });

        // 10. Logout
        // await page.getByRole('button', { name: /Log ud|Logout/i }).first().click();
    });
});
