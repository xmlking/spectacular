import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSingle } from '$lib/guides/loadGuides';

export const load = (async ({ params }) => {
	const { slug } = params;
	const { status, current, previous, next } = await getSingle(slug);

	if (status == 200) {
		return {
			actual: current,
			before: previous,
			after: next,
			mdsvexComponent: (await import(`../../../../content/guides/${slug}/index.svx`)).default
		};
	}

	throw error(404, 'Not found');
}) satisfies PageLoad;
