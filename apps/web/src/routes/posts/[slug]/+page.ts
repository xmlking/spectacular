import { error } from '@sveltejs/kit';
import { getSingle } from '$lib/posts/loadPosts';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { slug } = params;
	const { status, current, previous, next } = await getSingle(slug);

	if (status == 200) {
		return {
			actual: current,
			before: previous,
			after: next,
			mdsvexComponent: (await import(`../../../../content/posts/${slug}/index.svx`)).default
		};
	}

	throw error(404, 'Not found');
}) satisfies PageLoad;
