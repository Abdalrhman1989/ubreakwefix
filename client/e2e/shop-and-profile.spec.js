import { test, expect } from '@playwright/test';

test.describe('Shop and Profile Flow', () => {

    // Helper to generate unique user
    const uniqueId = Date.now();
    const user = {
        name: `Test User ${uniqueId}`,
        email: `test${uniqueId}@example.com`,
        password: 'password123',
        phone: '12345678',
        address: 'Test Street 1'
    };

    test.beforeEach(async ({ page }) => {
        // Register a new user before each test to ensure clean state
        await page.goto('http://localhost:5173/login');
        await page.click('a[href="/register"]'); // Switch to register
        await page.fill('input[name="name"]', user.name);
        await page.fill('input[name="email"]', user.email);
        await page.fill('input[name="password"]', user.password);
        await page.fill('input[name="confirmPassword"]', user.password);
        await page.fill('input[name="phone"]', user.phone);
        await page.fill('input[name="address"]', user.address);
        await page.click('button[type="submit"]');

        // Register redirects to Login
        await expect(page).toHaveURL('http://localhost:5173/login');

        // Now Login
        await page.fill('input[name="email"]', user.email);
        await page.fill('input[name="password"]', user.password);
        await page.click('button[type="submit"]');

        // Wait for profile
        await expect(page).toHaveURL('http://localhost:5173/profile', { timeout: 10000 });

        // Ensure cart is empty
        await page.evaluate(() => localStorage.removeItem('cart'));
    });

    test('Complete Shop Flow: Buy Item -> Checkout -> Verify in Profile', async ({ page }) => {
        // 1. Add Item to Cart
        await page.goto('http://localhost:5173/shop');
        // Wait for products to load
        await page.waitForSelector('.add-to-cart-btn', { timeout: 10000 });
        // Click "Læg i kurv" (Add) on first product
        await page.locator('.add-to-cart-btn').first().click();

        // 2. Go to Checkout
        await page.goto('http://localhost:5173/checkout');

        // 3. Fill Checkout details
        await page.waitForTimeout(1000);

        // Fill contact info if empty (using placeholders where available or assumed)
        // Since we logged in, some data matches user.
        // But let's fill placeholders just in case specific fields are empty
        // Using force=true if needed or just trying
        // Note: Checkout inputs might not have name attributes shown in analysis, assuming placeholders
        const nameInput = page.getByPlaceholder('Fulde navn');
        if (await nameInput.isVisible()) await nameInput.fill(user.name);

        const addrInput = page.getByPlaceholder('Adresse');
        if (await addrInput.isVisible()) await addrInput.fill(user.address);

        const zipInput = page.getByPlaceholder('Postnummer');
        if (await zipInput.isVisible()) await zipInput.fill('5000');

        // Accept Terms (last checkbox)
        await page.click('input[type="checkbox"] >> nth=-1');

        // 4. Submit Order (Payment)
        await page.click('button:has-text("Gå til betaling")');

        // 5. Handle Payment (Mocked)
        // Should redirect to success page automatically due to backend mock
        await expect(page).toHaveURL(/.*\/checkout\/success/, { timeout: 20000 });
        await expect(page.locator('h1')).toContainText('Tak for din bestilling'); // or "Tak"

        // 6. Verify in Profile
        await page.goto('http://localhost:5173/profile');

        // Click "Mine Ordrer" tab
        await page.click('button:has-text("Mine Ordrer")');

        // Check if order card exists
        const orderCard = page.locator('.order-card').first();
        await expect(orderCard).toBeVisible();
    });

    test('Complete Booking Flow: Book Repair -> Verify in Profile', async ({ page }) => {
        // 1. Go to Repairs
        await page.goto('http://localhost:5173/reparationer');

        // Select first Brand
        await page.waitForSelector('.card-glass', { timeout: 10000 });
        await page.locator('.card-glass').first().click();

        // Select first Model
        // Models are also card-glass lookalikes or similar
        // Wait for unique h3
        await page.waitForSelector('.card-glass h3', { timeout: 10000 });
        await page.locator('.card-glass').first().click();

        // Repair Page: Select first Repair
        // Button "Vælg reparation" inside card-glass
        await page.waitForSelector('.card-glass button', { timeout: 10000 });
        // The buttons have text "Vælg reparation"
        await page.locator('button:has-text("Vælg reparation")').first().click();

        // Click "Gå til kassen" in sidebar
        // It has text "Gå til kassen"
        await page.click('button:has-text("Gå til kassen")');

        // 2. Checkout
        await expect(page).toHaveURL(/.*\/checkout/);

        // Select Walk-in if available
        const walkIn = page.locator('div:has-text("Indkvartering i butik")').first();
        if (await walkIn.isVisible()) await walkIn.click();

        // Select Time (Mocked in checkout)
        // Just click anything that looks like a time slot if visible
        // Actually, if "walk-in" is selected, time slots appear?
        // Let's try to click a time slot if it appears "10:00"
        const timeSlot = page.locator('div:has-text(":")').first(); // Regex for time?
        if (await timeSlot.isVisible()) await timeSlot.click();

        // Payment: Pay in Store
        await page.click('text=Betal i butikken');

        // Terms
        await page.click('input[type="checkbox"] >> nth=-1');

        // Confirm
        await page.click('button:has-text("Bekræft Booking")');

        // 4. Success
        await expect(page).toHaveURL(/.*\/checkout\/success/);

        // 5. Verify in Profile
        await page.goto('http://localhost:5173/profile');
        await page.click('button:has-text("Mine Reparationer")');

        const bookingCard = page.locator('.booking-card, .repair-card, .order-card').first();
        // Note: Profile might reuse order-card class or have specific booking class.
        // Assuming visible.
        await expect(bookingCard).toBeVisible();
    });

});
