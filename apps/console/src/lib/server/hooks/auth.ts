import { NHOST_SESSION_KEY } from '$lib/constants';
import { i18n } from '$lib/i18n';
import { getServerNhost } from '$lib/server/utils/nhost';
import type { NhostSession } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
export const log = new Logger('server:middleware:auth');
/**
 * Auth middleware goal is to set `NhostClient` initialized from either session cookie or refreshToken and set it into locals.
 * If either cookie or refreshToken are not present, a dummy `NhostClient` is set into locals.
 * So next middleware or `+server.ts` has to check validity of session.
 * TODO:
 * refreshAuthPlugin: https://github.com/SprocketBot/sprocket/blob/dev/clients/web/src/client.ts
 * Use nhost.setRole('manager'), nhost.setRole('superviser'), nhost.unsetRole('manager') etc to
 * to set/unset/switch the user role for all subsequent graphql, storage and functions calls temporarily.
 * by default, user's default_role is used.
 */
export const auth = (async ({ event, resolve }) => {
  const { url, cookies } = event;
  log.debug('pathname:', url.pathname);

  const sessionCookieValue = cookies.get(NHOST_SESSION_KEY);
  const initialSession = sessionCookieValue ? (JSON.parse(atob(sessionCookieValue)) as NhostSession) : undefined;

  const nhost = await getServerNhost(initialSession);

  // check if refreshToken in URL
  const refreshToken = url.searchParams.get('refreshToken') || undefined;
  if (refreshToken) {
    log.debug({ refreshToken });
    const { session: newSession, error } = await nhost.auth.refreshSession(refreshToken);
    if (error) {
      // delete session cookie when the refreshToken has expired
      event.cookies.delete(NHOST_SESSION_KEY, { path: '/' });
      // TODO: should we throw error and display error to user?
      log.error('auth error:', error);
      redirect(303, i18n.resolveRoute(`/signin?redirectTo=${event.url.pathname}`));
    }

    if (newSession) {
      // Expire the cookie 60 seconds before the token expires
      // const expires = new Date();
      // expires.setSeconds(expires.getSeconds() + session.accessTokenExpiresIn - 60);
      // FIXME: *** btoa don't support unicode and throw error: DOMException [InvalidCharacterError]: Invalid character ***
      cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(newSession)), {
        path: '/',
        sameSite: 'strict',
        // make it as session cookie and let the browser refresh and update cookie
        httpOnly: false,
        // expires,
      });
    }
    event.url.searchParams.delete('refreshToken');
    // TODO: comment this block to proceed to next handler
    redirect(303, event.url.pathname);
  }

  // check if session is still valid
  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExpirationTime = nhost.auth.getDecodedAccessToken()?.exp;
  const accessTokenExpired = tokenExpirationTime && currentTime > tokenExpirationTime;
  if (accessTokenExpired) {
    log.debug('session expired:', { accessTokenExpired, path: event.url.pathname });
    // HINT: delete session cookie when accessTokenExpired and redirect to signin page.
    event.cookies.delete(NHOST_SESSION_KEY, { path: '/' });
    redirect(303, i18n.resolveRoute(`/signin?redirectTo=${event.url.pathname}`));
  }

  // HINT: set `nhost` into `locals` after `NhostSession` is initialized from
  // either session cookie or refreshToken but before `await resolve(event)` call.
  event.locals.nhost = nhost;
  const result = await resolve(event);
  return result;
}) satisfies Handle;
