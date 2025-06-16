import { expect, test } from '@playwright/test';

test('home page has expected footer', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toBeVisible();
});

test('paraglide demo page has expected h1', async ({ page }) => {
  await page.goto('/demo/paraglide');
  expect(await page.textContent('h1')).toBe('Hello, SvelteKit User from en!');
});

test.skip('Error 404, Page not found page has expected h1', async ({ page }) => {
  await page.goto('/errors/404');
  expect(await page.textContent('h1')).toBe('Page not found');
});

test.skip('Error 500 page has expected h1', async ({ page }) => {
  await page.goto('/errors/500');
  expect(await page.textContent('h1')).toBe('Something has gone seriously wrong');
});
