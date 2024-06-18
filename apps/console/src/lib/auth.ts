import { goto } from '$app/navigation';
import { nhost, user } from '$lib/stores/user';
import { Logger } from '@spectacular/utils';
/**
 * NOTE: These methods are still not in use.
 * TODO: Evaulate switching to auth managment to client,
 * and client manage session cookie and send to server.
 */
const log = new Logger('nhost.auth.brower');

export async function signUp(email: string, password: string, displayName: string) {
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
    user.set(nhost.auth.getUser());
    goto('/dashboard');
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  const { session, error } = await nhost.auth.signIn({ email, password });
  if (error) {
    log.error(error);
    throw error;
  }
  if (session) {
    user.set(nhost.auth.getUser());
    goto('/dashboard');
  }
}

export async function signOut() {
  const { error } = await nhost.auth.signOut();
  if (error) {
    log.error(error);
    throw error;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  return await nhost.auth.isAuthenticatedAsync();
}
