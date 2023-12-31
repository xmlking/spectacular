import { render, screen } from '@testing-library/svelte';
import { afterAll, beforeAll } from 'vitest';
import Index from './+page.svelte';

describe('Test index.svelte', () => {
	beforeAll(async () => {
		console.log('beforeAll...');
	});
	afterAll(async () => {
		console.log('afterAll...');
	});
	it('h1 exists', () => {
		const { getByText } = render(Index);
		expect(getByText('Combine GraphQL APIs into a unified supergraph')).toBeTruthy();
	});
	it('link to svelte website', () => {
		render(Index);

		const link = screen.getByRole('link', { name: /dashboard/i }); // getByLabelText
		expect(link).toHaveAttribute('href', '/dashboard');
	});
});
