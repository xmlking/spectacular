import { AuthClient } from './AuthClient';

/**
 * USAGE: in hooks.server.ts, add:
 *
 * // Initialize TokenVault
 * TokenVault.init([
 *	{
 *		endpoint: dynPriEnv.MY_BACKEND_ENDPOINT,
 *		authConfig: {
 *			auth_endpoint: dynPriEnv.MY_BACKEND_AUTH_ENDPOINT,
 *			client_id: dynPriEnv.MY_BACKEND_AUTH_CLIENT_ID,
 *			client_secret: dynPriEnv.MY_BACKEND_AUTH_CLIENT_SECRET,
 *			grant_type: dynPriEnv.MY_BACKEND_AUTH_CLIENT_GRANT_TYPE,
 *			scope: dynPriEnv.MY_BACKEND_AUTH_CLIENT_SCOPE
 *		}
 *	},
 * ]);
 *
 *
 * // Inject token for egress fetch calls
 * export const handleFetch = (async ({ event, request, fetch }) => {
 * 	const token = TokenVault.getToken(request.url);
 * 	if (token) {
 * 		request.headers.set('Authorization', `Bearer ${token}`);
 * 	}
 * 	return fetch(request);
 * }) satisfies HandleFetch;
 */
export class TokenVault {
	public static tokenMap: { [endpoint: string]: AuthClient } = {};

	/**
	 * Create a store.
	 */
	public static async init(
		backends: {
			endpoint: string;
			authConfig: {
				auth_endpoint: string;
				client_id: string;
				client_secret: string;
				grant_type: string;
				scope?: string;
				resource?: string;
			};
		}[]
	) {
		for (const ep of backends) {
			const {
				endpoint,
				authConfig: { auth_endpoint, ...rest }
			} = ep;
			this.tokenMap[getbaseUrl(endpoint)] = new AuthClient(auth_endpoint, rest);
		}
	}

	public static getToken(endpoint: string) {
		const backend = this.tokenMap[getbaseUrl(endpoint)];
		if (backend) return backend.getToken();
	}
}

export function getbaseUrl(urlStr: string) {
	const url = new URL(urlStr);
	const baseUrl = `${url.protocol}//${url.hostname}`;
	return baseUrl;
}
