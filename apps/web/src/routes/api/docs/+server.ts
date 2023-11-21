import { json } from '@sveltejs/kit';
import type { Post } from '$lib/types';
import { formatDateString } from '$lib/util';

async function getPosts(searchParams: URLSearchParams) {
	console.info('API: getPosts', searchParams);
	let posts: Post[] = [];
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });
	for (const [path, file] of Object.entries(paths)) {
		const slug = path.split('/').at(-1)?.replace('.md', '');
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			if (!metadata.published) continue;
			const post = { ...metadata, slug };
			post.date = formatDateString(post.date);
			posts.push(post);
		}
	}
	posts.sort((d1, d2) => new Date(d2.date).getTime() - new Date(d1.date).getTime());
	const category = searchParams.get('category');
	if (category) {
		posts = posts.filter((post) => post.categories.includes(category));
	}
	return posts;
}

export async function GET({ url }) {
	const posts = await getPosts(url.searchParams);
	return json(posts);
}
