import { error } from '@sveltejs/kit';
import { all } from '$lib/posts/loadCategory';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET = (async () => {
	const data = await all();
	const body = data.map((item) => ({
		...item
	}));

	if (body) {
		return new Response(JSON.stringify(body));
	}

	throw error(404, 'Nothing here yet');
}) satisfies RequestHandler;
