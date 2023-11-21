import { error } from '@sveltejs/kit';
import { groupedBy } from '$lib/posts/loadCategory';
import type { PageLoad } from './$types';

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
