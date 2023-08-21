import { building } from '$app/environment';
import { setSession } from '$houdini';
import type { Handle } from '@sveltejs/kit';
// import { getToken } from '@auth/core/jwt';
import { getSignedToken } from '$lib/server/middleware/authjs-helper';
import { Logger } from '$lib/utils';

const log = new Logger('middleware:houdini');
export const houdini = (async ({ event, resolve }) => {
	// skip auth logic on build to prevent infinite redirection in production mode
	// FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
	if (building) return await resolve(event);

	const { cookies, locals } = event;
	const session = await locals.getSession();
	const roles = session?.roles;

	// FIXME: always return null with @auth/core/jwt's getToken
	// const token = await getToken({req: { cookies: event.cookies, headers: event.request.headers },secret: dynPriEnv.AUTH_SECRET,raw: true});
	// const token = await getToken({ req: request, secret: dynPriEnv.AUTH_SECRET, raw: true });
	// const token = await getToken(cookies);
	// const token = await getToken(cookies, true); // raw = true
	const token = await getSignedToken(cookies);
	log.debug('setting token and roles......', token, roles);
	if (token) setSession(event, { token, roles });
	const response = await resolve(event);
	return response;
}) satisfies Handle;
