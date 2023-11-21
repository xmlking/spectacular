import type { Post } from '$lib/types';

export async function load({ fetch, url }) {
	console.info('Loading blogpost', url);
	const resp = await fetch('/api/docs?' + url.searchParams);
	const posts: Post[] = await resp.json();
	return { posts };
}
