import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { list } from '$lib/posts/loadPosts';

export const prerender = false;

export const GET = (async () => {
	const data = await list();
	const body = data.map((item) => ({
		...item
	}));

	if (body) {
		return new Response(JSON.stringify(body));
	}

	throw error(404, 'Nothing here yet');
}) satisfies RequestHandler;
