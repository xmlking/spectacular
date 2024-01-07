import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
export const log = new Logger('middleware:dead-links');

const dead_links_redirect_to: Record<string, string> = {
	'/api/fragments': '/api/fragment',
	'/api/vite': '/api/vite-plugin',
	'/blog/feed': ' /blog/feed.xml',
	'/api/cli': '/api/command-line',
	'/intro/fragments': '/intro/reusing-parts-of-a-query',
	'/api/graphql': '/api/graphql-magic',
	'/guides/plugin': '/guides/plugin-directory'
};

export const deadLinks = (async ({ event, resolve }) => {
	// If we have a value, let's redirect
	const redirectTo = dead_links_redirect_to[event.url.pathname];
	if (redirectTo) {
		log.debug(`redirecting ${event.url.pathname} to  ${redirectTo}`);
		redirect(303, `${event.url.origin}${redirectTo}`);
	}
	const result = await resolve(event);
	return result;
}) satisfies Handle;
