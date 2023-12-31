import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';

export const log = new Logger('middleware:detect-theme');

export const handleDetectTheme = (async ({ event, resolve }) => {
	let theme = '';

	const cookieTheme = event.cookies.get('theme');

	if (cookieTheme) {
		theme = cookieTheme;
	} else {
		event.cookies.set('theme', 'skeleton', { path: '/' });
		theme = 'skeleton';
	}

	log.debug({ theme });
	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});
}) satisfies Handle;
