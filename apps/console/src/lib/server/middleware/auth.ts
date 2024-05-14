import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { getNhost, removeNhostSessionInCookies, setNhostSessionInCookies } from '$lib/nhost';
import { i18n } from '$lib/i18n';
export const log = new Logger('server:middleware:auth');
/**
 * Auth middleware goal is to set `NhostClient` initialized from either session cookie or refreshToken and set it into locals.
 * If either cookie or refreshToken are not present, a dummy `NhostClient` is set into locals.
 * So next middleware or `+server.ts` has to check validity of session.
 * TODO:
 * refreshAuthPlugin: https://github.com/SprocketBot/sprocket/blob/dev/clients/web/src/client.ts
 * Use nhost.setRole('manager'), nhost.setRole('superviser'), nhost.unsetRole('manager') etc to
 * to set/unset/switch the user role for all subsequent graphql, storage and functions calls temporarily.
 * by default, user's default_role is used.
 */
export const auth = (async ({ event, resolve }) => {
	log.debug('auth: pathname:', event.url.pathname);

	const nhost = await getNhost(event.cookies);

	const session = nhost.auth.getSession();

	const refreshToken = event.url.searchParams.get('refreshToken') || undefined;

	const currentTime = Math.floor(Date.now() / 1000);
	const tokenExpirationTime = nhost.auth.getDecodedAccessToken()?.exp;
	const accessTokenExpired = session && tokenExpirationTime && currentTime > tokenExpirationTime;

	// FIXME: https://github.com/nhost/nhost/issues/2028
	if (accessTokenExpired || refreshToken) {
		const { session: newSession, error } = await nhost.auth.refreshSession(refreshToken);
		if (error) {
			// delete session cookie when the refreshToken has expired
			removeNhostSessionInCookies(event.cookies);
			// TODO: should we throw error and display error to user?
			log.error('auth error:', error);
			redirect(303, i18n.resolveRoute('auth/signin'));
		}

		if (newSession) {
			setNhostSessionInCookies(event.cookies, newSession);
		}

		if (refreshToken) {
			event.url.searchParams.delete('refreshToken');
			// TODO: comment this block to proceed to next handler
			redirect(303, event.url.pathname);
		}
	}

	// HINT: set `nhost` into `locals` after `NhostSession` is initialized from
	// either session cookie or refreshToken but before `await resolve(event)` call.
	event.locals.nhost = nhost;
	const result = await resolve(event);
	return result;
}) satisfies Handle;
