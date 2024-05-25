import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { building } from '$app/environment';
// import { getToken } from '@auth/core/jwt';
import { getSignedToken } from '$lib/server/middleware/authjs-helper';
import { setSession } from '$houdini';

const log = new Logger('middleware:houdini');
export const houdini = (async ({ event, resolve }) => {
	// skip auth logic on build to prevent infinite redirection in production mode
	// FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
	if (building) return await resolve(event);

	const { cookies, locals } = event;
	const session = await locals.auth();
	const roles = session?.roles;

	// FIXME: always return null with @auth/core/jwt's getToken
	// const token = await getToken({ secret: envPri.HASURA_GRAPHQL_JWT_SECRET_KEY, salt: cookieName, event.request });
	const token = await getSignedToken(cookies);
	log.debug('setting token and roles......', token, roles);
	if (token) setSession(event, { token, roles });
	const response = await resolve(event);
	return response;
}) satisfies Handle;
