import { building } from '$app/environment';
import { i18n } from '$lib/i18n';
import { Logger, startsWith } from '@repo/utils';
import type { Handle } from '@sveltejs/kit';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';

/**
 * Protect the route
 * This should be the next middleware after auth middleware.
 */
const log = new Logger('server:middleware:guard');
// TODO define roles in apps/console/src/lib/links.ts
const adminPaths = ['/admin/organizations', '/admin/users'];
const orgPaths = ['/org/', '/reports/', '/flows/'];
const publicPaths = [
  '/favicon.ico',
  '/robots.txt',
  '/assets',
  '/fonts',
  '/signin',
  '/signup',
  '/reset',
  '/privacy',
  '/terms',
  '/docs',
  '/blog',
  '/about',
  '/contact',
  '/.well-known/',
];

// skip auth logic on build to prevent infinite redirection in production mode
// FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
// TODO: why this line getting removed by biome?
// if (building) return await resolve(event);

export const guard = (async ({ event, resolve }) => {
  // biome-ignore format: <ok>
  if (building) return await resolve(event);

  // TODO:
  // check if user present in houdini middleware
  // get user roles
  // check if role has access to target route

  const {
    url: { pathname, searchParams },
    locals: {
      paraglide: { lang },
      nhost,
    },
  } = event;

  // bypass guard for home-page ('/') or if path that starts with any of the `publicPaths`
  const canonicalPath = i18n.route(pathname);
  if (canonicalPath === '/' || startsWith(canonicalPath, publicPaths)) {
    // bypass guard for all unprotected routes.
    return await resolve(event);
  }

  // Check isAuthenticated
  const { isAuthenticated, isLoading } = nhost.auth.getAuthenticationStatus();
  const hasRefreshToken = searchParams.has('refreshToken');
  log.debug({ hasRefreshToken, isAuthenticated, isLoading, lang });

  // HINT: only redirect to signin page when not authenticated and not RefreshToken case
  if (!hasRefreshToken && !isAuthenticated) {
    const message: App.Superforms.Message = { type: 'error', message: 'Not authenticated' } as const;
    redirectWithFlash(303, i18n.resolveRoute(`/signin?redirectTo=${pathname}`), message, event);
  }

  const session = nhost.auth.getSession();

  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExpirationTime = nhost.auth.getDecodedAccessToken()?.exp;
  const accessTokenExpired = session && tokenExpirationTime && currentTime > tokenExpirationTime;

  if (accessTokenExpired) {
    log.debug('session expired at: ', tokenExpirationTime);
    // FIXME: redirect from middleware may cause recursion
    // event.cookies.delete(NHOST_SESSION_KEY, { path: '/' })
    const message: App.Superforms.Message = { type: 'warning', message: 'Session expired' } as const;
    redirectWithFlash(303, i18n.resolveRoute(`/signin?redirectTo=${pathname}`), message, event);
  }

  // Check authorizations
  // const user = nhost.auth.getUser()
  // const claims = nhost.auth.getHasuraClaims()
  // log.debug({ claims });
  const roles = nhost.auth.getHasuraClaim('allowed-roles');
  const role = nhost.auth.getHasuraClaim('default-role') as string;
  const orgs = nhost.auth.getHasuraClaim('allowed-orgs');
  const org = nhost.auth.getHasuraClaim('default-org');
  log.debug({ roles, role, orgs, org });

  if (startsWith(pathname, orgPaths)) {
    if (!['org:owner', 'org:admin', 'org:billing'].includes(role)) {
      const message: App.Superforms.Message = { type: 'warning', message: "You don't have access" } as const;
      redirectWithFlash(303, i18n.resolveRoute('/profile'), message, event);
    }
  }

  if (startsWith(pathname, adminPaths)) {
    if (role !== 'sys:admin') {
      const message: App.Superforms.Message = { type: 'warning', message: "You don't have access" } as const;
      redirectWithFlash(303, i18n.resolveRoute('/dashboard'), message, event);
    }
  }

  const response = await resolve(event);
  return response;
}) satisfies Handle;
