import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { Logger, startsWith } from '@spectacular/utils';
import { building } from '$app/environment';
import { i18n } from '$lib/i18n.js';
/**
 * Protect the route
 * This should be the next middleware after auth middleware.
 */
const log = new Logger('server:middleware:guard');
const protectedPaths = ['/dashboard', '/account', '/api', '/downloads'];
const adminPaths = ['/dashboard/admin'];
const userPaths = ['/downloads'];

export const guard = (async ({ event, resolve }) => {
	// skip auth logic on build to prevent infinite redirection in production mode
	// FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
	if (building) return await resolve(event);

	// TODO:
	// check if user present in houdini middleware
	// get user roles
	// check if role has access to target route

	const {
		url: { pathname },
		locals: { lang, nhost }
	} = event;
	const canonicalPath = i18n.route(pathname);
	// bypass guard for all unprotected routes.
	if (!startsWith(canonicalPath, protectedPaths)) {
		return await resolve(event);
	}

	const { isAuthenticated, isLoading } = nhost.auth.getAuthenticationStatus();
	log.debug({ isAuthenticated, isLoading, lang });
	if (!isAuthenticated) {
		redirect(303, i18n.resolveRoute(`/auth/signin?callbackUrl=${pathname}`));
	}

	const session = nhost.auth.getSession();

	const currentTime = Math.floor(Date.now() / 1000);
	const tokenExpirationTime = nhost.auth.getDecodedAccessToken()?.exp;
	const accessTokenExpired = session && tokenExpirationTime && currentTime > tokenExpirationTime;

	if (accessTokenExpired) {
		log.debug('session expired at: ', tokenExpirationTime);
		// FIXME: redirect from middleware may cause recursion
		// event.cookies.delete(NHOST_SESSION_KEY, { path: '/' })
		redirect(303, i18n.resolveRoute('/logout?callbackUrl=/blog'));
	}

	// const user = nhost.auth.getUser()
	// const claims = nhost.auth.getHasuraClaims()
	// log.debug({ claims });
	const roles = nhost.auth.getHasuraClaim('allowed-roles');
	const orgs = nhost.auth.getHasuraClaim('orgs');
	log.debug({ roles, orgs });

	if (startsWith(pathname, userPaths)) {
		if (!roles?.includes('user')) {
			redirect(303, i18n.resolveRoute('/home'));
		}
	}
	if (startsWith(pathname, adminPaths)) {
		if (!roles?.includes('supervisor')) {
			redirect(303, i18n.resolveRoute('/dashboard'));
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
