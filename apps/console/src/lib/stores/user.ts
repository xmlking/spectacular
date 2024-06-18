import { browser } from '$app/environment';
import { PUBLIC_NHOST_REGION, PUBLIC_NHOST_SUBDOMAIN } from '$env/static/public';
import { NHOST_SESSION_KEY } from '$lib/constants';
import type { User } from '@nhost/nhost-js';
import { NhostClient } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import { readable, writable } from 'svelte/store';

const log = new Logger('user.store.client');

export const nhost = new NhostClient({
  subdomain: PUBLIC_NHOST_SUBDOMAIN || 'local',
  region: PUBLIC_NHOST_REGION,
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
