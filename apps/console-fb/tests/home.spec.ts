import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.serial('Home page', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('has Home in title and get started link linking to the dashboard page @fast', async ({ page }) => {
		await page.goto('/');

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Home/);

		// create a locator
		const aboutUs = page.getByText('About us');

		// ----> IMPORTANT!!! Check that it's visible 👀
		await expect(aboutUs).toBeVisible();

		// Expect an attribute "to be strictly equal" to the value.
		await expect(aboutUs).toHaveAttribute('href', '/about');

		// Click the get started link.
		await aboutUs.click();

		// Expects the URL to contain intro.
		await expect(page).toHaveURL(/about/);
	});

	test('has H1 content @slow', async ({ page }) => {
		await page.goto('/');

		expect(await page.textContent('h1')).toBe('Combine GraphQL APIs into a unified supergraph');
	});

	test.skip('skiped: login with google', async ({ page }) => {
		// This test is not run
		await page.goto('/');
		await page.bringToFront();
		await expect(page.getByRole('heading', { name: 'Combine GraphQL APIs into a unified supergraph' })).toBeVisible();

		// Recording...
		const { USERNAME = 'sumo', PASSWORD = 'demo' } = process.env;
		await page.getByRole('link', { name: 'dashboard-link' }).click();
		await expect(page).toHaveURL(/login/);
		await page.getByRole('button', { name: 'Google' }).click();
		await expect(page).toHaveURL(new RegExp('^https://accounts.google.com.*'));
		await page.getByRole('textbox', { name: 'Email or phone' }).fill(USERNAME);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.getByRole('textbox', { name: 'Enter your password' }).fill(PASSWORD);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.getByRole('link', { name: 'arrow right on rectangle Sign Out' }).click();
		await page.getByRole('link', { name: 'dashboard-link' }).click();
	});
});
