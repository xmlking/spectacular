import { hasErrorMessage, hasErrorTypes, isErrorType, Logger } from '@repo/utils';
import { error, redirect } from '@sveltejs/kit';
import { createClient as createWSClient } from 'graphql-ws';
import { browser } from '$app/environment';
import { invalidateAll } from '$app/navigation';
import { env } from '$env/dynamic/public';
import { type ClientPlugin, getClientSession, HoudiniClient } from '$houdini';
import { subscription } from '$houdini/plugins';
import { GRAPHQL_URL } from '$lib/constants';

const url = env.PUBLIC_NHOST_GRAPHQL_URL ?? GRAPHQL_URL;
const log = new Logger(browser ? 'houdini.browser.client' : 'houdini.server.client');

// in order to verify that we send metadata, we need something that will log the metadata after
const logMetadata: ClientPlugin = () => ({
  end(ctx, { resolve, value }) {
    if (ctx.metadata?.logResult === true) {
      log.info(JSON.stringify(value));
    }

    resolve(ctx);
  },
});

const subClient: ClientPlugin = subscription(({ session }) =>
  createWSClient({
    url: url.replace('https://', 'wss://').replace('http://', 'ws://'),
    connectionParams: () => {
      return {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      };
    },
  })
);

// Export the Houdini client
// Ref: https://github.com/hanshoi/sveltekit-nhost-houdini-example/blob/master/src/client.ts
// HINT: If your API uses HTTP-Only cookies, don’t forget to add credentials: "include" to fetchParams return value
export default new HoudiniClient({
  url,
  fetchParams({ session, metadata }) {
    if (metadata) {
      log.debug('metadata...', { metadata });
    }
    if (session) {
      log.debug('session...', { session });
    }
    // use client-side AT if avaiable !!!
    const accessToken = session?.accessToken;
    const backendToken = metadata?.backendToken;
    const useRole = metadata?.useRole;
    const adminSecret = metadata?.adminSecret;

    return {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(useRole ? { 'x-hasura-role': useRole } : {}),
        ...(adminSecret ? { 'X-Hasura-Admin-Secret': adminSecret } : {}),
        ...(backendToken ? { backendToken } : {}),
      },
      // Instruct the browser to add cookies to cross-origin requests
      credentials: 'include', // Tip: for HTTP-Only cookies
    };
  },
  /*
  // NOTE: we are using `silently` mode
  // Ref: https://houdinigraphql.com/api/client#error-handling
  throwOnError: {
    // can be any combination of
    // query, mutation, subscription, and all
    operations: ['all'],
    // GraphQL error handling on client-side
    error: async (errors, ctx) => {
      log.error({ ctx, errors });
      // if accessToken(AT) expires (15min), reloading the page will refresh AT and set new AT into cookie
      // e.g. goto with invalidateAll on current path
      if (errors.some(hasErrorMessage('JWTExpired'))) {
        // if accessToken(AT) expires (15min), reloading the page will refresh AT and set new AT into cookie
        // e.g. goto with invalidateAll on current path
        await invalidateAll();
      } else if (errors.some(hasErrorMessage('missing session variable: "x-hasura-auth-elevated"'))) {
        log.error('FIXME: did you miss adding `elevate()` check before this GQL action?');
        error(403, `(${ctx.artifact.name}): ${errors.map((err) => err.message).join('. ')}.`);
      } else if (errors.some(hasErrorTypes(['PERMISSION_DENIED', 'UNAUTHENTICATED']))) {
        redirect(303, '/signin'); // TODO: ?redirectTo=/dashboard
      } else if (errors.some(isErrorType('NOT_FOUND'))) {
        error(404);
      }
      // be silent for rest of the errors
      // error(500, `(${ctx.artifact.name}): ` + errors.map((err) => err.message).join('. ') + '.')
    },
  },
  */
  plugins: [subClient, ...(browser ? [logMetadata] : [])],
});
