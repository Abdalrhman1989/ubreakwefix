import { test, expect } from '@playwright/test';

test('Checkout Payment Flow', async ({ page }) => {
    // 1. Add item to cart
    await page.goto('http://localhost:5173/reparation/iphone-13-screen'); // Adjust URL to a real repair page
    // Fallback if direct link doesn't add to cart, go to home and navigate
    await page.goto('http://localhost:5173/');
    await page.getByText('iPhone', { exact: false }).first().click();
    // Select a model and repair (assuming flow)
    // Since I don't know the exact selector for "Add to Cart", I'll try to find a button.
    // Actually, let's use the Checkout page directly if we can mock the cart state, 
    // but Playwright starts fresh. We need to populate the cart.

    // Use a script to inject item into local storage if possible, or simple flow
    // Simulating user flow:
    // Assuming there's a "Reparationer" page
    await page.goto('http://localhost:5173/reparationer');
    await page.waitForTimeout(1000);
    // Click first avail brand/model
    // This is fragile without knowing the exact DOM.
    // Let's assume the user has items.

    // Alternative: manually inject cart data into localStorage
    await page.addInitScript(() => {
        window.localStorage.setItem('cart', JSON.stringify([{
            uniqueId: 'test-item-1',
            modelName: 'Test Phone',
            repairName: 'Screen Repair',
            price: 1000
        }]));
    });

    await page.goto('http://localhost:5173/checkout');

    // 2. Fill Checkout Form
    await page.fill('input[placeholder="John Doe"]', 'Test User');
    await page.fill('input[placeholder="john@example.com"]', 'test@example.com');
    await page.fill('input[placeholder="+45 12 34 56 78"]', '12345678');
    await page.fill('input[placeholder="Street name and number"]', 'Test Street 1');
    await page.fill('input[placeholder="1234"]', '1234');
    await page.fill('input[placeholder="Copenhagen"]', 'København');

    // 3. Select Shipping (First option should be auto-selected, but good to ensure)
    // Verify shipping options loaded
    await expect(page.locator('input[name="shipping"]')).not.toHaveCount(0);

    // Mock Payment API
    await page.route('**/api/payment/link', async route => {
        const json = { url: 'https://payment.quickpay.net/test-link' };
        await route.fulfill({ json });
    });

    // 4. Submit
    await page.click('button:has-text("Confirm Order")');

    // 5. Expect Redirection to Quickpay
    // Quickpay URL usually contains "payment.quickpay.net"
    await page.waitForURL(/payment.quickpay.net/);

    // 6. Verify Quickpay Page Content (just to be sure we are there)
    await expect(page).toHaveTitle(/Quickpay/i);

});
