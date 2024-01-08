import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { building } from '$app/environment';
import { setSession } from '$houdini';

const log = new Logger('middleware:houdini');
export const houdini = (async ({ event, resolve }) => {
	// skip auth logic on build to prevent infinite redirection in production mode
	// FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
	if (building) return await resolve(event);

	const { locals } = event;
	const token = locals.nhost.auth.getAccessToken();
	const roles = locals.nhost.auth.getHasuraClaim('allowed-roles');

	log.debug('setting token and roles......', token, roles);
	if (token) setSession(event, { token, roles });
	const response = await resolve(event);
	return response;
}) satisfies Handle;
