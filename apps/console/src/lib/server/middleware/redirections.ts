/**
 *  Usage:
 * Add to src/hooks.server.js:
 * import { redirections } from 'sveltekit-redirections'
 * import { sequence } from '@sveltejs/kit/hooks'
 *
 * export const handle = sequence([
 *   redirections({
*     '/github': 'https://github.com/joshnuss',
 *     '/documentation': '/docs'
 *   }),

 *   // more handlers...
 *  ])
 */
import type { Handle } from '@sveltejs/kit';

export function redirections(rules: Record<string, string>): Handle {
  return ({ event, resolve }) => {
    const url = rules[event.url.pathname];

    if (url) {
      return Response.redirect(url, 303);
    }

    return resolve(event);
  };
}
