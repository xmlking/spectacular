import { Logger } from '@spectacular/utils';
import type { Reroute } from '@sveltejs/kit';

export const log = new Logger('universal:middleware:dead-links');

const dead_links_redirect_to: Record<string, string> = {
  '/api/fragments': '/api/fragment',
  '/api/vite': '/api/vite-plugin',
  '/blog/feed': ' /blog/feed.xml',
  '/api/cli': '/api/command-line',
  '/intro/fragments': '/intro/reusing-parts-of-a-query',
  '/api/graphql': '/api/graphql-magic',
  '/guides/plugin': '/guides/plugin-directory',
};

/**
 * Handle Dead Links
 * TODO: this is replacemnt for src/lib/server/middleware/redirections.ts handler.
 * use it in hooks.ts
 */
export const dead_links: Reroute = ({ url }) => {
  // If we have a value, let's redirect
  const reroutedPath = dead_links_redirect_to[url.pathname];
  if (url.pathname in dead_links_redirect_to) {
    log.debug(`redirecting ${url.pathname} to  ${reroutedPath}`);
    return dead_links_redirect_to[url.pathname];
  }
};
