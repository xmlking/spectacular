import { NhostClient } from '@nhost/nhost-js';
import type { NhostSession } from '@nhost/nhost-js';
import type { Cookies } from '@sveltejs/kit';
import { waitFor } from 'xstate/lib/waitFor';
import { env } from '$env/dynamic/public';
// import { env as secrets } from '$env/dynamic/private';

export const NHOST_SESSION_KEY = 'nhostSession';
const isBrowser = typeof window !== 'undefined';

export async function getNhost(cookies: Cookies) {
	const nhost = new NhostClient({
		subdomain: env.PUBLIC_NHOST_SUBDOMAIN || 'local',
		region: env.PUBLIC_NHOST_REGION,
		// Disable automations on server-side.
		// Need cookie storage for auth trasfering to SSR.
		autoSignIn: isBrowser,
		autoRefreshToken: isBrowser,
		clientStorageType: 'cookie',
		// HINT: When set, it is sent as an `x-hasura-admin-secret` header for all GraphQL, Storage, and Serverless Functions requests.
		// adminSecret: secrets.HASURA_GRAPHQL_ADMIN_SECRET,
		start: false
	});

	const sessionCookieValue = cookies.get(NHOST_SESSION_KEY) || '';

	const initialSession: NhostSession = JSON.parse(atob(sessionCookieValue) || 'null');

	nhost.auth.client.start({ initialSession });

	if (nhost.auth.client.interpreter) {
		await waitFor(nhost.auth.client.interpreter, (state) => !state.hasTag('loading'));
	}

	return nhost;
}

/**
 * Use this function to set nhost session into cookie - from SignIn/SignUp/auth-miggleware
 * @param cookies
 * @param session
 */
export function setNhostSessionInCookies(cookies: Cookies, session: NhostSession) {
	const expires = new Date();
	// * Expire the cookie 60 seconds before the token expires
	expires.setSeconds(expires.getSeconds() + session.accessTokenExpiresIn - 60);
	console.log({ expires });
	// TODO: Set expires based on the actual refresh token expire time
	// For now, we're using 30 days so the cookie is not removed when the browser is closed because if `expiers` is omitted, the cookie becomes a session cookie.
	cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), { path: '/' });
	// cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), { path: '/', expires });
}

/**
 * delete nhost session cookie
 * @param cookies
 */
export function removeNhostSessionInCookies(cookies: Cookies) {
	cookies.delete(NHOST_SESSION_KEY, { path: '/' });
	// cookies.set(NHOST_SESSION_KEY, '', { httpOnly: true, path: '/', maxAge: 0 });
}
