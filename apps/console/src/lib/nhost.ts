import { goto } from '$app/navigation';
import { SearchSecurityKeysStore } from '$houdini';
import { getNhostClient } from '$lib/stores/nhost';
import { Logger } from '@spectacular/utils';

/**
 * NOTE: These methods are still not in use.
 * TODO: Evaulate switching to auth managment to client,
 * and client manage session cookie and send to server.
 */
const log = new Logger('nhost.auth.brower');

export async function signUp(email: string, password: string, displayName: string) {
  const nhost = getNhostClient();
  const { session, error } = await nhost.auth.signUp({
    email,
    password,
    options: {
      displayName,
    },
  });
  if (error) {
    log.error(error);
    throw error;
  }
  if (session) {
    goto('/dashboard');
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  const nhost = getNhostClient();
  const { session, error } = await nhost.auth.signIn({ email, password });
  if (error) {
    log.error(error);
    throw error;
  }
  if (session) {
    goto('/dashboard');
  }
}

export async function signOut() {
  const nhost = getNhostClient();
  const { error } = await nhost.auth.signOut();
  if (error) {
    log.error(error);
    throw error;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const nhost = getNhostClient();
  return await nhost.auth.isAuthenticatedAsync();
}

const skQuery = new SearchSecurityKeysStore().artifact.raw;
export async function hasSecurityKey(userId: string) {
  const nhost = getNhostClient();
  const { data, error } = await nhost.graphql.request(skQuery, { userId });
  if (error) {
    log.error({ error });
    return false;
  }
  return data?.authUserSecurityKeys.length > 0;
}
