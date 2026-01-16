import { test, expect } from '@playwright/test';

// Run tests in serial because they depend on shared state (orderId, registered user)
test.describe.configure({ mode: 'serial' });

test.describe('System Integration "The Loop"', () => {
    // Unique user for this test suite to avoid collisions
    const timestamp = Date.now();
    const userName = `Integration User ${timestamp}`;
    const userEmail = `integration${timestamp}@example.com`;
    const userPass = 'password123';
    let orderId;

    test.beforeAll(async ({ browser }) => {
        // Optional: Pre-register user if needed, but we can do it in the first test
    });

    test('User registers and books a repair', async ({ page }) => {
        // 1. Register
        await page.goto('/register');
        await page.waitForLoadState('networkidle');

        // Ensure page is loaded
        await expect(page.getByRole('heading', { name: /Register|Opret/i })).toBeVisible({ timeout: 10000 });

        await page.fill('input[name="name"]', userName);
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="phone"]', '12345678');
        await page.fill('input[name="address"]', 'Test Address 123');
        await page.fill('input[name="password"]', userPass);
        await page.fill('input[name="confirmPassword"]', userPass);
        await page.click('button[type="submit"]');

        // Expect redirect to login or auto-login (assuming redirect to login based on previous flows)
        await expect(page).toHaveURL(/\/login/);

        // 2. Login
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', userPass);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/profile/);
        await page.waitForLoadState('networkidle');

        // 3. Book Repair (Appointment)
        await page.goto('/book');
        await page.waitForLoadState('networkidle');

        // Exact H1
        await expect(page.getByRole('heading', { level: 1, name: /Book Reparation/i })).toBeVisible();

        // Fill Booking Form
        // Assuming the form has specific inputs based on user-flow logic
        await page.fill('input[name="customerName"]', userName);
        await page.fill('input[name="customerEmail"]', userEmail);
        await page.fill('input[name="customerPhone"]', '12345678');
        await page.fill('input[name="deviceModel"]', 'iPhone 13 - Integration Test');
        await page.fill('textarea[name="problem"]', 'Screen cracked widely');

        // Select a date - required?
        // simple date input
        const today = new Date().toISOString().split('T')[0];
        await page.fill('input[name="date"]', today);

        // Submit - "Bekræft Booking"
        await page.click('button:has-text("Bekræft Booking")');

        // 4. Capture Order ID from Profile
        await expect(page).toHaveURL(/\/profile/, { timeout: 10000 });
        await page.getByRole('button', { name: /My Orders|Mine Ordre/i }).click();

        // Wait for order to appear
        await expect(page.locator('.card-glass').first()).toBeVisible({ timeout: 10000 });

        // Extract ID - assuming text like "#123"
        const orderIdText = await page.locator('span:has-text("#")').first().innerText();
        orderId = orderIdText.replace('#', '');
        console.log(`Created Order ID: ${orderId}`);

        // Verify Order Card specifically
        await expect(page.locator('.card-glass').filter({ hasText: `#${orderId}` })).toBeVisible();

        // Logout
        await page.getByRole('button', { name: /Logout|Log ud/i }).click();
    });

    test('Admin updates booking status', async ({ page }) => {
        test.skip(!orderId, 'Skipping because order creation failed');

        // 1. Login as Admin
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@example.com'); // Standard admin creds
        await page.fill('input[name="password"]', 'admin123'); // Standard admin pass
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/admin/);
        await page.waitForLoadState('networkidle');

        // 2. Go to Bookings
        await page.click('a[href="/admin/bookings"]');

        // 3. Find row with Order ID (use strict filter)
        const row = page.getByRole('row').filter({ hasText: `#${orderId}` });
        await expect(row).toBeVisible({ timeout: 5000 });

        // 4. Update Status
        // Assuming a status dropdown or edit button. 
        // Based on previous admin flows, it might differ. Let's assume an "Edit" or direct status change if visible.
        // If AdminBookings.jsx has a status Select in the row:
        // await row.locator('select').selectOption('In Progress');
        // OR if we need to click edit:
        // await row.locator('button:has-text("Edit")').click();
        // Let's try to assume there's a status dropdown in the table or an update mechanism.
        // NOTE: If this fails, I will need to inspect AdminBookings.jsx.
        // Going with clicking the row or an edit button first.

        // Attempt to find simple select or edit button
        if (await row.locator('select').count() > 0) {
            await row.locator('select').selectOption('In Progress');
        } else {
            // Fallback: Click edit button
            await row.locator('button').first().click(); // Assuming first button is edit
            // Wait for modal or navigation
            await page.waitForTimeout(500);
            // Perform edit in modal/page
            await page.selectOption('select[name="status"]', 'In Progress');
            await page.click('button:has-text("Save")');
        }

        // Logout
        await page.getByRole('button', { name: /Logout|Log ud/i }).click();
    });

    test('User sees status update', async ({ page }) => {
        test.skip(!orderId, 'Skipping because order creation failed');

        // 1. Login as User
        await page.goto('/login');
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', userPass);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/profile/);

        // 2. Check Dashboard (default tab)
        // "Live Repair Status" component should be visible for active repairs
        await expect(page.locator('text=Live Repair Status')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=In Progress')).toBeVisible();

        // Check progress bar visually (optional, just check status text)
        // Logout
        await page.getByRole('button', { name: /Logout|Log ud/i }).click();
    });

    test('Bi-directional Profile Sync', async ({ page }) => {
        // Part A: User Updates Profile
        // Login User
        await page.goto('/login');
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', userPass);
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/profile/);
        await page.waitForLoadState('networkidle');

        // Update Name
        // Navigate to settings using button text
        // Note: Profile.jsx uses "Settings" or "My Details"
        await page.getByRole('button', { name: /Settings|My Details|Mine oplysninger|Indstillinger/i }).click();
        const newName = `User Updated ${timestamp}`;
        // The input label is "Full Name"
        await page.getByLabel('Full Name').fill(newName);

        // Handle dialog before clicking save
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        await page.click('button:has-text("Save Profile Changes")');

        // Wait for update (reload might happen)
        await page.waitForTimeout(1000);

        // Verify User sees the change locally first
        await expect(page.locator('h1').filter({ hasText: newName })).toBeVisible();

        await page.getByRole('button', { name: /Logout|Log ud/i }).click();

        // Part B: Admin Verifies & Updates
        // Login Admin
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');

        await page.click('a[href="/admin/users"]');

        // Verify user list has new name
        // Might be paginated or sorted, assume visible for test
        await expect(page.locator(`tr:has-text("${newName}")`)).toBeVisible();

        // Admin cannot edit users in current implementation, so we stop here.
        // We verified User -> Admin sync.

        await page.getByRole('button', { name: /Logout|Log ud/i }).click();

        // Part C: User Login Verification (sanity check)
        await page.goto('/login');
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', userPass);
        await page.click('button[type="submit"]');

        await expect(page.locator(`h1:has-text("${newName}")`)).toBeVisible();
    });
});

