import { json } from '@sveltejs/kit';
import { to_number } from 'svelte/internal';

export const GET = async ({ url }) => {
	await new Promise((res) => setTimeout(res, url.searchParams.has('delay') ? to_number(url.searchParams.get('delay')) : 2000));
	return json({
		hello: 'world'
	});
};
