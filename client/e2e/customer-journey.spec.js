import { test, expect } from '@playwright/test';

test.describe('Customer Journey', () => {
    test('Search, Add to Cart, and Checkout Flow', async ({ page }) => {
        // 1. Land on Home
        await page.goto('/');
        await expect(page).toHaveTitle(/UBreak\s*WeFix/i);

        // 2. Search for a device
        const searchInput = page.getByPlaceholder(/Indtast venligst dit mærke og model/i);
        await searchInput.fill('iPhone 13');
        // Wait for debounce and results
        // Wait for debounce and results - check for specific model
        await expect(page.getByText('iPhone 13').first()).toBeVisible({ timeout: 10000 });
        await page.getByText(/iPhone 13/i).first().click();

        // 3. Verify Repair Page
        await expect(page.getByRole('heading', { name: /iPhone 13/i })).toBeVisible();

        // 4. Add "Skærm" repair to cart
        // Assuming "Skærm" exists and has a "Vælg" button nearby or the card itself is clickable
        await page.getByRole('button', { name: /Vælg reparation/i }).first().click();

        // 5. Verify added to cart (toast or UI update)
        // For now, check if "Gå til kassen" button becomes active or clickable
        const checkoutBtn = page.getByRole('button', { name: /Gå til kassen/i });
        await expect(checkoutBtn).toBeVisible();
        await checkoutBtn.click();

        // 6. Checkout Page
        await expect(page.url()).toContain('/checkout');
        await expect(page.getByText(/Checkout/i).first()).toBeVisible();

        // 7. Fill Form (if not logged in)
        await page.getByPlaceholder(/John Doe/i).fill('Test User');
        await page.getByPlaceholder(/john@example.com/i).fill('test@example.com');
        await page.getByPlaceholder(/\+45/i).fill('12345678');

        // 8. Submit
        await page.getByRole('button', { name: /Confirm Order/i }).click();

        // 9. Success
        await expect(page.getByText(/Order Confirmed!/i)).toBeVisible();
    });
});
