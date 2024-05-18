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
// TODO define roles in apps/console/src/lib/links.ts
const managerPaths = ['/admin'];
const publicPaths = ['/', '/favicon.ico', '/robots.txt', '/assets', '/fonts', '/signin', '/signup', '/privacy', '/terms'];

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
		locals: {
			paraglide: { lang },
			nhost
		}
	} = event;
	const canonicalPath = i18n.route(pathname);
	// bypass guard for all unprotected routes.
	if (startsWith(canonicalPath, publicPaths)) {
		return await resolve(event);
	}

	// Check isAuthenticated
	const { isAuthenticated, isLoading } = nhost.auth.getAuthenticationStatus();
	log.debug({ isAuthenticated, isLoading, lang });
	if (!isAuthenticated) {
		redirect(303, i18n.resolveRoute(`/signin?callbackUrl=${pathname}`));
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

	// Check authorizations
	// const user = nhost.auth.getUser()
	// const claims = nhost.auth.getHasuraClaims()
	// log.debug({ claims });
	const roles = nhost.auth.getHasuraClaim('allowed-roles');
	const role = nhost.auth.getHasuraClaim('default-role');
	const orgs = nhost.auth.getHasuraClaim('orgs');
	const org = nhost.auth.getHasuraClaim('default-org');
	log.debug({ roles, role, orgs, org });

	if (startsWith(pathname, managerPaths)) {
		if (role != 'manager') {
			// if (!roles?.includes('manager')) {
			redirect(303, i18n.resolveRoute('/dashboard'));
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
