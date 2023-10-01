import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getSingle } from '$lib/guides/loadGuides';

export const prerender = false;

export const GET = (async ({ url }) => {
	const { pathname } = url;
	const slug = pathname.substring(pathname.lastIndexOf('/') + 1);

	if (slug) {
		const data = await getSingle(slug);

		if (data) {
			return new Response(JSON.stringify(data));
		}
	}

	throw error(404, 'Guides not found');
}) satisfies RequestHandler;
