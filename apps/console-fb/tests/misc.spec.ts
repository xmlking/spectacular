import { expect, test } from '@playwright/test';

// By default, tests in a single file are run in order.
// If you have many independent tests in a single file and want to run in parallel, set this:
test.describe.configure({ mode: 'parallel' });

test('Home page should have Login button', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('link', { name: 'dashboard-link' })).toHaveText('Get Started');
});

test.skip('skip this test', async ({ page }) => {
	// This test is not run
	await page.bringToFront();
	// Recording...
	await expect(page.getByText('Installation')).toBeVisible();
});
