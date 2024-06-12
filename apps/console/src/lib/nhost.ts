import { invalidate } from '$app/navigation';
import { PUBLIC_NHOST_REGION, PUBLIC_NHOST_SUBDOMAIN } from '$env/static/public';
import { NhostClient } from '@nhost/nhost-js';
import type { NhostClientConstructorParams, NhostSession, User } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import Cookies from 'js-cookie';
import { writable } from 'svelte/store';

const log = new Logger('nhost.client-side');

export const NHOST_SESSION_KEY = 'nhostSession';
const isBrowser = typeof window !== 'undefined';

// class SvelteKitNhostClient extends NhostClient {
//   constructor(params: NhostClientConstructorParams) {
//     super({
//       ...params,
//       autoSignIn: isBrowser && params.autoSignIn,
//       autoRefreshToken: isBrowser && params.autoRefreshToken,
//       clientStorageType: 'web',
//       start: false,
//     });

//     this.auth.onAuthStateChanged(() => {
//       setNhostSessionInCookie(this);
//     });
//     this.auth.onTokenChanged(setNhostSessionInCookie);
//   }
//   start() {
//     //initialize
//   }
// }

export const nhost = new NhostClient({
  subdomain: PUBLIC_NHOST_SUBDOMAIN || 'local',
  region: PUBLIC_NHOST_REGION,
  autoSignIn: isBrowser,
  autoRefreshToken: isBrowser,
  clientStorageType: 'web',
  start: false,
});

export const user = writable <User>();

if (isBrowser) {
  nhost.auth.onAuthStateChanged((event, session) => {
    log.debug(`The auth state has changed. State is now ${event} with session: ${session}`);
    setNhostSessionInCookie(session);
    invalidate('nhost:auth');
    // window.location.reload();
  });
  nhost.auth.onTokenChanged((session) => {
    log.debug('The access and refresh token has changed');
    setNhostSessionInCookie(session);
  });

  init();
}

export function init() {
  log.debug('initializing nhost client...');
  const sessionCookieValue = Cookies.get(NHOST_SESSION_KEY);
  const initialSession = sessionCookieValue ? (JSON.parse(atob(sessionCookieValue)) as NhostSession) : undefined;
  nhost.auth.client.start({ initialSession });
}

/**
 * Set the Nhost session in a cookie
 * @param {NhostSession} session - The session to set in the cookie
 */
function setNhostSessionInCookie(session: NhostSession | null) {
  if (session === null) {
    Cookies.remove(NHOST_SESSION_KEY);
    return;
  }

  const expires = new Date();
  // Expire the cookie 60 seconds before the token expires
  expires.setSeconds(expires.getSeconds() + session.accessTokenExpiresIn - 60);
  Cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), {
    sameSite: 'strict',
    expires,
  });
  if (session?.user) user.set(session.user);
}

/**
 * Log out a user
 * @returns {Promise<boolean>} - Whether the logout was successful
 */
export async function logOut() {
  const { error } = await nhost.auth.signOut();
  if (error) log.error(error);
}
