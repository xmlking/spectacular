import { error } from '@sveltejs/kit';
import { all } from '$lib/posts/loadCategory';
import type { Sveltin } from '$sveltin';

export const load = async () => {
	const data = await all();
	const metadata = data as unknown as Array<Sveltin.ContentMetadata>;

	if (metadata) {
		return {
			metadata
		};
	}

	throw error(404, 'Not found');
};
