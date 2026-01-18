import { test, expect } from '@playwright/test';

test.describe('Contact and Booking Flows', () => {

    test('Contact Form should send correct data and language (English)', async ({ page }) => {
        // 1. Intercept the API call
        let requestBody;
        await page.route('**/api/contact', async route => {
            requestBody = route.request().postDataJSON();
            await route.continue();
        });

        // 2. Navigate to Contact page
        await page.goto('http://localhost:5173/kontakt');

        // Force English via localStorage
        await page.evaluate(() => localStorage.setItem('language', 'en'));
        await page.reload();

        // 3. Fill Contact Form
        await page.fill('input[name="name"]', 'John Doe');
        await page.fill('input[name="email"]', 'john@example.com');
        await page.fill('input[name="subject"]', 'Test Subject');
        await page.fill('textarea[name="message"]', 'This is a test message from E2E.');

        // 4. Submit
        await page.click('button:has-text("Send")');

        // 5. Verify Success UI
        // 5. Verify Success UI
        await expect(page.getByTestId('contact-success-message')).toBeVisible();

        // 6. Verify Payload
        expect(requestBody).toBeTruthy();
        expect(requestBody.name).toBe('John Doe');
        expect(requestBody.language).toBe('en');
    });

    test('Booking Form should send correct data and language (Danish)', async ({ page }) => {
        // 1. Intercept API
        let requestBody;
        await page.route('**/api/bookings', async route => {
            requestBody = route.request().postDataJSON();
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        });

        // 2. Navigate
        await page.goto('http://localhost:5173/kontakt');

        // Force Danish via localStorage
        await page.evaluate(() => localStorage.setItem('language', 'da'));
        await page.reload();

        // 3. Start Booking Flow
        const bookBtn = page.getByRole('button', { name: 'Book Tid' }).or(page.getByRole('button', { name: 'Vælg tid' })).first();
        await bookBtn.waitFor();
        await bookBtn.click();

        // Wait for scheduler to appear/load
        await page.waitForSelector('input[type="date"]');

        // Set Date (Future date to avoid past validation)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        const dateStr = futureDate.toISOString().split('T')[0];

        await page.fill('input[type="date"]', dateStr);

        // Select Time
        await page.getByTestId('time-slot-10:00').click();

        // Next (Step 1 -> Step 2)
        await page.getByTestId('booking-next-btn').click();

        // 4. Fill Details (Step 2)
        await page.getByTestId('booking-name-input').fill('Danish Tester');
        await page.getByTestId('booking-email-input').fill('danish@example.com');
        await page.getByTestId('booking-phone-input').fill('12345678');
        await page.getByTestId('booking-reason-input').fill('Skærmskift'); // Reason

        // 5. Confirm (Submit)
        await page.getByTestId('booking-submit-btn').click();

        // 6. Verify Success
        await expect(page.locator('text=Tak for din booking!')).toBeVisible();

        // 7. Verify Payload
        expect(requestBody).toBeTruthy();
        expect(requestBody.customerName).toBe('Danish Tester');
        expect(requestBody.deviceModel).toBe('Butiksbesøg');
        expect(requestBody.language).toBe('da'); // Assuming default or switch logic worked
    });

});
