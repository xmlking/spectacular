import { NHOST_SESSION_KEY } from '$lib/constants';
import { getServerNhost } from '$lib/server/utils/nhost';
import type { NhostSession } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import type { Handle } from '@sveltejs/kit';
export const log = new Logger('server:middleware:auth');
/**
 * Auth middleware goal is to set `NhostClient` initialized from  session cookie.
 * If either cookie not present, a dummy `NhostClient` is set into locals.
 * So next middleware or `+server.ts` has to check validity of session.
 * TODO:
 * Use nhost.setRole('manager'), nhost.setRole('superviser'), nhost.unsetRole('manager') etc to
 * to set/unset/switch the user role for all subsequent graphql, storage and functions calls temporarily.
 * by default, user's default_role is used.
 */
export const auth = (async ({ event, resolve }) => {
  const { url, cookies } = event;
  log.debug({ pathname: url.pathname });
  const sessionCookieValue = cookies.get(NHOST_SESSION_KEY);
  const initialSession = sessionCookieValue ? (JSON.parse(atob(sessionCookieValue)) as NhostSession) : undefined;
  const nhost = await getServerNhost(initialSession);
  event.locals.nhost = nhost;
  const result = await resolve(event);
  return result;
}) satisfies Handle;
