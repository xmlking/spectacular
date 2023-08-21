import { dev } from '$app/environment';
import type { Browser, Page } from '@playwright/test';
import { chromium } from '@playwright/test';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

let browser: Browser;
let page: Page;
const notCI = dev;

describe.skip('playwright using vitest runner', () => {
	beforeAll(async () => {
		browser = await chromium.launch();
	});
	afterAll(async () => {
		await browser.close();
	});

	beforeEach(async () => {
		page = await browser.newPage();
	});
	afterEach(async () => {
		await page.close();
	});

	it.runIf(notCI)('example should work', async () => {
		await page.goto('https://www.example.com/');
		expect(await page.title()).toBe('Example Domain');
	});
});
