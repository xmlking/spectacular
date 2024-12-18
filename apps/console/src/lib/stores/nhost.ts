import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { SearchSecurityKeysStore, extractSession, getClientSession, setClientSession } from '$houdini';
import { NHOST_SESSION_KEY } from '$lib/constants';
import { NhostClient, type NhostClientConstructorParams } from '@nhost/nhost-js';
import type { User } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import Cookies from 'js-cookie';
import { getContext, onDestroy, setContext } from 'svelte';
import { type Readable, type Writable, derived, get, readable, readonly, writable } from 'svelte/store';

// WORKAROUND: remove next line
export let at: string | undefined;

// TODO: change to Svelte 5 Class: https://x.com/ankurpsinghal/status/1856719524059283897
const skQuery = new SearchSecurityKeysStore().artifact.raw;
export class SvelteKitNhostClient extends NhostClient {
  #log = new Logger('auth.store.client');

  #user = writable<User | null>(null);
  /**
   *  Readable: updates every time the authentication status changes from signed-in to signed-out.
   */
  readonly isAuthenticated: Readable<boolean>;
  /**
   *  Readable: updates every time the access or refresh token is changed.
   */
  readonly accessToken: Readable<string | null>;

  /**
   * Readable: updates when `accessToken` changed.
   * e.g., when `nhost.auth.elevateEmailSecurityKey(emmail)` is called or `accessToken` refeshed.
   */
  readonly elevated: Readable<boolean>;

  constructor(params: NhostClientConstructorParams) {
    super({
      ...params,
      start: browser,
      autoSignIn: browser,
      autoRefreshToken: browser,
      clientStorageType: 'cookie',
    });

    this.isAuthenticated = readable<boolean>(false, (set) => {
      if (browser) {
        set(this.auth.isAuthenticated());
        this.auth.onAuthStateChanged((event, session) => {
          this.#log.debug(`The auth state has changed. State is now ${event} with session:`, { session });
          switch (event) {
            case 'SIGNED_IN':
              set(true);
              this.#user.set(session?.user || null);
              break;
            case 'SIGNED_OUT':
              set(false);
              this.#user.set(null);
              Cookies.remove(NHOST_SESSION_KEY);
              break;
          }
        });
        return () => this.#log.debug('no more subscribers for isAuthenticated');
      }
    });

    this.accessToken = readable<string | null>(null, (set) => {
      if (browser) {
        set(this.auth.getAccessToken() ?? null);
        this.auth.onTokenChanged((session) => {
          this.#log.debug('The access token refreshed:', { session });
          const accessToken = session?.accessToken;
          set(accessToken ?? null);
          // set fresh accessToken into HoudiniClient's session (client-side only)
          setClientSession({ accessToken });
          // FIXME: after setClientSession() AT changes back to stale server-side AT in few sec
          // WORKAROUND: remove next line
          at = accessToken;
          // save session as cookie everytime token is refreshed or user signin via WebAuthN.
          // Cookie will be removed when browser closed or user explicitly SIGNED_OUT.
          Cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), {
            path: '/',
            // Not setting `expires` explicitly means, cookie expires when browser is closed.
            // expires: session?.accessTokenExpiresIn,
            sameSite: 'strict',
            secure: true,
          });
        });
        return () => this.#log.debug('no more subscribers for accessToken');
      }
    });

    this.elevated = derived(
      [this.accessToken, this.#user],
      ([$at, $user]) => {
        return $at && $user ? this.auth.getHasuraClaim('x-hasura-auth-elevated') === $user.id : false;
      },
      false,
    );

    onDestroy(() => {
      // Do cleanup ???
      this.#log.debug('onDestroy called');
    });
  }

  get user() {
    return readonly(this.#user);
  }

  async isAuthenticatedAsync(): Promise<boolean> {
    return await this.auth.isAuthenticatedAsync();
  }

  /**
   * elevate if neededelevateEmailSecurityKey
   * @returns error
   */
  async elevate() {
    const $elevated = get(this.elevated);
    const $user = get(this.#user);
    if (!$elevated && $user?.id && (await this.hasSecurityKey())) {
      const { error } = await this.auth.elevateEmailSecurityKey($user?.email as string);
      if (error) return error;
    }
    return null;
  }

  async hasSecurityKey() {
    const userId = get(this.#user)?.id;
    const { data, error } = await this.graphql.request(skQuery, { userId });
    if (error) {
      this.#log.error({ error });
      return false;
    }
    return data?.authUserSecurityKeys.length > 0;
  }
}

// this is important if u are gonna have any SSR
// https://www.youtube.com/watch?v=EyDV5XLfagg
// https://kit.svelte.dev/docs/state-management

const NHOST_CLIENT_KEY = Symbol('NHOST_CLIENT');

/**
 * We should not have exported state like this, to prevent:
 * Session state shared between different users when rendered on server(SSR), but don't worry,
 * This custom `nhost` object will not have sensitive data on server-side,
 * as we carefully check if this code is running in the browser, then only set session data.
 */
// export let nhost: SvelteKitNhostClient;

export const setNhostClient = () => {
  const nhost = new SvelteKitNhostClient({
    // subdomain: env.PUBLIC_NHOST_SUBDOMAIN || 'local',
    // region: env.PUBLIC_NHOST_REGION,
    authUrl: env.PUBLIC_NHOST_AUTH_URL,
    graphqlUrl: env.PUBLIC_NHOST_GRAPHQL_URL,
    storageUrl: env.PUBLIC_NHOST_STORAGE_URL,
    functionsUrl: env.PUBLIC_NHOST_FUNCTIONS_URL,
  });
  return setContext(NHOST_CLIENT_KEY, nhost);
};

export const getNhostClient = () => {
  return getContext<ReturnType<typeof setNhostClient>>(NHOST_CLIENT_KEY);
};
