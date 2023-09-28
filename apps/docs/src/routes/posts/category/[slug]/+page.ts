import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { groupedBy } from '$lib/posts/loadCategory';

export const load = (async ({ params }) => {
	const { slug } = params;
	const metadata = await groupedBy(slug);

	if (metadata) {
		return {
			slug,
			metadata
		};
	}

	throw error(404, 'Not found');
}) satisfies PageLoad;
