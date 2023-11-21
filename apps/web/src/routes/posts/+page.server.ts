import { error } from '@sveltejs/kit';
import { list } from '$lib/posts/loadPosts';
import type { PageServerLoad } from './$types';
import type { Sveltin } from '$sveltin';

export const load = (async () => {
	const resourceName = 'posts';
	const data = await list();
	const items: Array<Sveltin.ResourceContent> = [];

	data.forEach((elem) => {
		const item: Sveltin.ResourceContent = {
			resource: resourceName,
			metadata: <Sveltin.YAMLFrontmatter>elem.meta,
			html: ''
		};
		items.push(item);
	});

	if (resourceName && items) {
		return {
			resourceName,
			items
		};
	}

	throw error(404, 'Not found');
}) satisfies PageServerLoad;
