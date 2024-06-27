import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { PUBLIC_NHOST_REGION, PUBLIC_NHOST_SUBDOMAIN } from '$env/static/public';
import { NHOST_SESSION_KEY } from '$lib/constants';
import { hasSecurityKey } from '$lib/nhost';
import type { User } from '@nhost/nhost-js';
import { NhostClient } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import Cookies from 'js-cookie';
import { derived, get, readable, readonly, writable } from 'svelte/store';

const log = new Logger('user.store.client');

export const nhost = new NhostClient({
  // subdomain: PUBLIC_NHOST_SUBDOMAIN || 'local',
  // region: PUBLIC_NHOST_REGION,
  authUrl: env.PUBLIC_NHOST_AUTH_URL,
  graphqlUrl: env.PUBLIC_NHOST_GRAPHQL_URL,
  storageUrl: env.PUBLIC_NHOST_STORAGE_URL,
  functionsUrl: env.PUBLIC_NHOST_FUNCTIONS_URL,
  start: browser
});

/**
 * Readable: updates every time the authentication status changes from signed-in to signed-out, vice versa.
 * a private `_user` Writable used internally.
 */
export const _user = writable<User | null>(null);
export const user = readonly(_user);

/**
 *  Readable: updates every time the authentication status changes from signed-in to signed-out.
 */
export const isAuthenticated = readable<boolean>(false, (set) => {
  if (browser) {
    set(nhost.auth.isAuthenticated());
    nhost.auth.onAuthStateChanged((event, session) => {
      log.debug(`The auth state has changed. State is now ${event} with session:`, { session });
      switch (event) {
        case 'SIGNED_IN':
          set(true);
          _user.set(session?.user || null);
          break;
        case 'SIGNED_OUT':
          set(false);
          _user.set(null);
          Cookies.remove(NHOST_SESSION_KEY);
          break;
      }
    });
    return () => log.debug('no more subscribers for isAuthenticated');
  }
});

/**
 *  Readable: updates every time the access or refresh token is changed.
 */
export const accessToken = readable<string | null>(null, (set) => {
  if (browser) {
    set(nhost.auth.getAccessToken() ?? null);
    nhost.auth.onTokenChanged((session) => {
      log.debug('The access token refreshed:', { session });
      set(session?.accessToken ?? null);
      // save session as cookie everytime token is refreshed or user signin via WebAuthN
      Cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), {
        path: '/',
        sameSite: 'strict',
        secure: true,
      });
    });
    return () => log.debug('no more subscribers for accessToken');
  }
});

/**
 * Readable: updates when `accessToken` changed.
 * e.g., when `nhost.auth.elevateEmailSecurityKey(emmail)` is called or `accessToken` refeshed.
 */
export const elevated = derived(
  [accessToken, user],
  ([$at, $user]) => {
    return $at && $user ? nhost.auth.getHasuraClaim('x-hasura-auth-elevated') === $user.id : false;
  },
  false,
);
/**
 * elevate if neededelevateEmailSecurityKey
 * @returns error
 */
export async function elevate() {
  const $elevated = get(elevated);
  const $user = get(user);
  if (!$elevated && $user?.id && (await hasSecurityKey($user.id))) {
    const { error } = await nhost.auth.elevateEmailSecurityKey(get(user)?.email as string);
    if (error) return error;
  }
  return null;
}
