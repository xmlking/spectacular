import { building } from '$app/environment';
import { setSession } from '$houdini';
import { Logger } from '@repo/utils';
import type { Handle } from '@sveltejs/kit';

const log = new Logger('server:middleware:houdini');
export const houdini = (async ({ event, resolve }) => {
  // skip auth logic on build to prevent infinite redirection in production mode
  // FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
  if (building) return await resolve(event);

  const {
    locals: { nhost },
  } = event;
  const accessToken = nhost.auth.getAccessToken();
  const claims = nhost.auth.getHasuraClaims();
  // HINT: role, userId, orgId will be globally available in Houdini Session to be used as `runtimeScalars`
  const role = claims?.['x-hasura-default-role'];
  const userId = claims?.['x-hasura-user-id'];
  const orgId = claims?.['x-hasura-default-org'] as string;

  if (accessToken) setSession(event, { accessToken, role, userId, orgId });

  const response = await resolve(event);
  return response;
}) satisfies Handle;
