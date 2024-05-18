import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { building } from '$app/environment';
import { setSession } from '$houdini';

const log = new Logger('server:middleware:houdini');
export const houdini = (async ({ event, resolve }) => {
	// skip auth logic on build to prevent infinite redirection in production mode
	// FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
	if (building) return await resolve(event);

	const { locals } = event;
	const accessToken = locals.nhost.auth.getAccessToken();
	const session = locals.nhost.auth.getSession();

	log.debug('setting accessToken:', accessToken);
	log.debug('setting accessToken:', session);
	// FIXME: remove session check after https://github.com/nhost/nhost/issues/2028
	if (session && accessToken) setSession(event, { accessToken });
	const response = await resolve(event);
	return response;
}) satisfies Handle;
