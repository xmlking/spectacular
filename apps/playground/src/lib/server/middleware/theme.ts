import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';

export const log = new Logger('server:middleware:detect-theme');

export const theme = (async ({ event, resolve }) => {
    let theme = '';

    const cookieTheme = event.cookies.get('theme');

    if (cookieTheme) {
        theme = cookieTheme;
    } else {
        event.cookies.set('theme', 'skeleton', { path: '/' });
        theme = 'skeleton';
    }

    log.debug({ theme });
    const result = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`),
    });
    return result;
}) satisfies Handle;
