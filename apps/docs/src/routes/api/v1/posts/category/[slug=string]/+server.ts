import { error } from '@sveltejs/kit';
import { groupedBy } from '$lib/posts/loadCategory';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET = (async ({ url }) => {
	const { pathname } = url;
	const metadataName = pathname.substring(pathname.lastIndexOf('/') + 1);

	if (metadataName) {
		const data = await groupedBy(metadataName);

		if (data) {
			return new Response(JSON.stringify(data));
		}
	}

	throw error(404, 'Nothing here yet');
}) satisfies RequestHandler;
