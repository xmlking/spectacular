import { Logger } from '@repo/utils';
import type { Handle } from '@sveltejs/kit';

export const log = new Logger('server:middleware:detect-theme');
const in2035 = new Date('2035-01-01');

export const theme = (async ({ event, resolve }) => {
  let theme = '';

  const cookieTheme = event.cookies.get('theme');

  if (cookieTheme) {
    theme = cookieTheme;
  } else {
    event.cookies.set('theme', 'skeleton', { path: '/', expires: in2035 });
    theme = 'skeleton';
  }

  log.debug({ theme });
  const result = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`),
  });
  return result;
}) satisfies Handle;
