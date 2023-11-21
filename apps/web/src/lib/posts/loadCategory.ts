import { groupedByOne } from '$lib/utils/collections.js';
import { list } from './loadPosts';
import type { Sveltin } from '$sveltin';

export const all = async (): Promise<Sveltin.ContentMetadata[]> => {
	const mdName = 'category';
	const data = await list();
	const values = ['title', 'slug', 'headline'];
	const grouped = groupedByOne(mdName, data, values);

	const mList: Array<Sveltin.ContentMetadata> = [];
	grouped.map((elem) => {
		const metadata: Sveltin.ContentMetadata = {
			name: elem['name'],
			items: []
		};
		elem['items'].forEach((e: Sveltin.YAMLFrontmatter) => {
			metadata.items.push(e);
		});
		mList.push(metadata);
	});
	return mList;
};

export const groupedBy = async (slug: string): Promise<Sveltin.ContentMetadata> => {
	const data = await all();
	const metadata = data.find((item) => {
		return item.name === slug;
	});

	if (metadata) {
		return metadata;
	}

	return undefined;
};
