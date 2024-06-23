import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { PUBLIC_NHOST_REGION, PUBLIC_NHOST_SUBDOMAIN } from '$env/static/public';
import { NHOST_SESSION_KEY } from '$lib/constants';
import type { User } from '@nhost/nhost-js';
import { NhostClient } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import { derived, readable, writable } from 'svelte/store';

const log = new Logger('user.store.client');

export const nhost = new NhostClient({
  // subdomain: PUBLIC_NHOST_SUBDOMAIN || 'local',
  // region: PUBLIC_NHOST_REGION,
  authUrl: env.PUBLIC_NHOST_AUTH_URL,
  graphqlUrl: env.PUBLIC_NHOST_GRAPHQL_URL,
  storageUrl: env.PUBLIC_NHOST_STORAGE_URL,
  functionsUrl: env.PUBLIC_NHOST_FUNCTIONS_URL,
});

export const user = writable<User | null>(null);

export const isAuthenticated = readable<boolean>(false, (set) => {
  nhost.auth.onAuthStateChanged((event, session) => {
    log.debug(`The auth state has changed. State is now ${event} with session:`, { session });
    switch (event) {
      case 'SIGNED_IN':
        set(true);
        user.set(session?.user || null);
        break;
      case 'SIGNED_OUT':
        set(false);
        user.set(null);
        break;
    }
  });
});

export const accessToken = readable<string | null>(null, (set) => {
  set(nhost.auth.getAccessToken() ?? null);
  nhost.auth.onTokenChanged((session) => {
    log.debug('The access token refreshed:', { session });
    set(session?.accessToken ?? null);
  });
});

export const elevated = derived([accessToken, user], ([$at, $user]) => {
  return $at && $user  ? nhost.auth.getHasuraClaim('x-hasura-auth-elevated') === $user.id : false;
});
