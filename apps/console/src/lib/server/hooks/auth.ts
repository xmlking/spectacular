import { NHOST_SESSION_KEY } from '$lib/constants';
import { NhostClient, type NhostSession } from '@nhost/nhost-js';
import { Logger } from '@spectacular/utils';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const log = new Logger('server:middleware:auth');
/**
 * Auth middleware goal is to create/initialize NhostClient from session cookie.
 * If cookie not present, a dummy `NhostClient` is set into locals.
 * So next middleware or `+server.ts` has to check validity of session.
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

/**
 * Creates nHost client that runs on the server-side.
 * @param initialSession
 * @returns
 */
async function getServerNhost(session: NhostSession | undefined) {
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
  if (session) {
    await nhost.auth.initWithSession({ session });
  }

  return nhost;
}
