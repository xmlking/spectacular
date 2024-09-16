import { env } from '$env/dynamic/private';
import { NHOST_SESSION_KEY } from '$lib/constants';
import { NhostClient } from '@nhost/nhost-js';
import type { NhostSession } from '@nhost/nhost-js';
// import { env as secrets } from '$env/dynamic/private';
import { Logger } from '@spectacular/utils';
import type { Cookies } from '@sveltejs/kit';
import { waitFor } from 'xstate/lib/waitFor';

const log = new Logger('nhost.server.client');

const isBrowser = typeof window !== 'undefined';
/**
 * Creates an Nhost client that runs on the server-side.
 * @param initialSession
 * @returns
 */
export async function getServerNhost(initialSession: NhostSession | undefined, cookies: Cookies) {
  const nhost = new NhostClient({
    // subdomain: env.NHOST_SUBDOMAIN ?? 'local',
    // region: env.NHOST_REGION,
    authUrl: env.NHOST_AUTH_URL,
    graphqlUrl: env.NHOST_GRAPHQL_URL,
    storageUrl: env.NHOST_STORAGE_URL,
    functionsUrl: env.NHOST_FUNCTIONS_URL,
    autoSignIn: false,
    autoRefreshToken: false,
    clientStorageType: 'cookie',
    start: false,
  });

  log.debug('initializing nhost cleint...');

  nhost.auth.client.start({ initialSession });

  if (nhost.auth.client.interpreter) {
    await waitFor(nhost.auth.client.interpreter, (state) => !state.hasTag('loading'));
  }

  return nhost;
}

/**
 * Use this function to set nhost session into cookie - from SignIn/SignUp/auth-miggleware
 * @param {Cookies} cookies - svelte cookies
 * @param {NhostSession} session - The session to set in the cookie
 */
export function setNhostSessionInCookies(cookies: Cookies, session: NhostSession) {
  // Expire the cookie 60 seconds before the token expires
  // const expires = new Date();
  // expires.setSeconds(expires.getSeconds() + session.accessTokenExpiresIn - 60);
  // FIXME: *** btoa don't support unicode and throw error: DOMException [InvalidCharacterError]: Invalid character ***
  cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), {
    path: '/',
    sameSite: 'strict',
    // make it as session cookie and let the browser refresh and update cookie
    httpOnly: false,
    // expires,
  });
}
