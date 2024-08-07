import { building } from '$app/environment';
import { Logger, startsWith } from '@spectacular/utils';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
/**
 * Protect the route
 * It should be the last middleware
 */
const log = new Logger('middleware:guard');
const protectedPaths = ['/dashboard', '/account', '/api', '/downloads'];
const adminPaths = ['/organizations', '/users', '/groups', '/delegations'];
const userPaths = ['/downloads'];
export const guard = (async ({ event, resolve }) => {
  // skip auth logic on build to prevent infinite redirection in production mode
  // FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
  if (building) return await resolve(event);

  // TODO:
  // check if user present in houdini middleware
  // get user roles
  // check if role has access to target route

  const {
    url: { pathname, origin },
    locals,
  } = event;

  if (!startsWith(pathname, protectedPaths)) {
    return await resolve(event);
  }

  const { user, roles, expires } = (await locals.auth()) ?? {};
  // log.debug('Session roles-->', roles);

  if (!user) {
    // FIXME: redirect from middleware may cause recursion
    redirect(303, `${origin}/auth/signin?callbackUrl=${pathname}`);
  }
  if (expires && new Date(expires) < new Date()) {
    log.debug('session expired at: ', expires);
    redirect(303, `${origin}/auth/signout?callbackUrl=/blog`);
  }
  if (startsWith(pathname, userPaths)) {
    if (!roles?.includes('user')) {
      redirect(303, `${origin}/home`);
    }
  }
  if (startsWith(pathname, adminPaths)) {
    if (!roles?.includes('Policy.Write')) {
      redirect(303, `${origin}/dashboard`);
    }
  }

  const response = await resolve(event);
  return response;
}) satisfies Handle;
