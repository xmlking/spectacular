import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	await new Promise((res) => setTimeout(res, url.searchParams.has('delay') ? parseInt(url.searchParams.get('delay') ?? '2000') : 2000));
	return json({
		hello: 'world'
	});
};
