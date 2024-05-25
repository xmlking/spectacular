import type { Provider } from '@auth/core/providers';
import AzureAD from '@auth/core/providers/azure-ad';
import CredentialsProvider from '@auth/core/providers/credentials';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
// import { HasuraAdapter } from '@auth/hasura-adapter';
import { SvelteKitAuth  } from '@auth/sveltekit';
import type {SvelteKitAuthConfig} from '@auth/sveltekit';
import { Logger } from '@spectacular/utils';
import envPri from '$lib/variables/variables.server';
import envPub from '$lib/variables/variables';
import { dev } from '$app/environment';
import users from '$mocks/data/users';
import { getOrg } from './org-mapper';
import { appRoles } from './role-mapper';

// import { HasuraAdapter } from 'next-auth-hasura-adapter';

// Reference: https://authjs.dev/reference/sveltekit

// TODO: https://hasura.io/learn/graphql/hasura-authentication/integrations/nextjs-auth/
// https://github.com/yaroslavnosenko/recode-ui/blob/main/pages/api/auth/%5B...nextauth%5D.ts
// https://github.com/artizen-fund/artizen-frontend/blob/main/src/lib/apollo/apolloClient.ts

const log = new Logger('middleware:auth');
const redirectProxyUrl = `${envPub.PUBLIC_BASE_URL}/auth`;

export const authHookConfig: SvelteKitAuthConfig = {
	debug: dev,
	// HINT: when using https (local dev or prod) set this to true
	useSecureCookies: true,
	trustHost: true,
	basePath: '/auth',
	secret: envPri.HASURA_GRAPHQL_JWT_SECRET_KEY,
	redirectProxyUrl,
	// adapter: HasuraAdapter({
	// 	endpoint: envPri.PUBLIC_GRAPHQL_ENDPOINT,
	// 	adminSecret: envPri.HASURA_GRAPHQL_ADMIN_SECRET
	// }),
	providers: [
		...(dev
			? [
					CredentialsProvider({
						name: 'Password',
						credentials: {
							email: {
								label: 'Email',
								type: 'text',
								placeholder: 'enter your email'
							},
							password: { label: 'Password', type: 'password' }
						},
						async authorize({ email, password }) {
							const user = users.get(email as string);
							if (user) {
								if (user.validPassword(password as string)) {
									return {
										id: email as string,
										name: user.name,
										org: user.org,
										roles: user.roles,
										email: email as string
									};
								}
							}
							return null;
						}
					})
				]
			: []),
		Google({
			clientId: envPri.AUTH_PROVIDER_GOOGLE_CLIENT_ID,
			clientSecret: envPri.AUTH_PROVIDER_GOOGLE_CLIENT_SECRET,
			authorization: { params: { prompt: 'consent' } }
		}),
		AzureAD({
			clientId: envPri.AUTH_PROVIDER_AZUREAD_CLIENT_ID,
			clientSecret: envPri.AUTH_PROVIDER_AZUREAD_CLIENT_SECRET,
			tenantId: envPri.AUTH_PROVIDER_AZUREAD_TENANT,
			authorization: { params: { scope: 'openid profile User.Read email' } }
			// client: {},
		}),
		GitHub({
			clientId: envPri.AUTH_PROVIDER_GITHUB_CLIENT_ID,
			clientSecret: envPri.AUTH_PROVIDER_GITHUB_CLIENT_SECRET
		})
	] as Provider[],
	callbacks: {
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
		// pages: {
		// 	signIn: '/login'
		// },
		async jwt({ token, user, account, profile, trigger }) {
			// log.debug('token>>>', token);
			// log.debug('user>>>', user);
			// log.debug('account>>>', account);
			// log.debug('profile>>>', profile);
			// log.debug('trigger>>>', trigger);
			// profile == undefined when login with CredentialsProvider
			if (!profile && user) profile = { roles: user.roles, upn: user.id };
			const isSignIn = !!(user && profile && account);
			if (isSignIn) {
				log.debug('in isSignIn');
				token.email ??= profile.upn;
				token.roles ??= appRoles(profile.roles ?? profile.groups);
				token.org = getOrg(token.email);
				// `scp` or `scope` is required for Spring Security.
				const scp = Array.isArray(token.roles) ? token.roles.join(' ') : undefined;
				token.scp = scp;

				// token.accessToken = account.access_token; // account.id_token

				token['https://hasura.io/jwt/claims'] = {
					'x-hasura-allowed-roles': token.roles,
					'x-hasura-default-role': 'user',
					'x-hasura-allowed-orgs': `{${token.org}}`,
					'x-hasura-default-org': token.org,
					'x-hasura-user-id': token.email
				};

				// FIXME: for Azure AD picture is base64 and it is too big to fit in cookie.
				// will through `431 Request Header Fields Too Large` unless we remove it.
				if (token.picture?.startsWith('data:')) delete token.picture;
			}
			return token;
		},
		async session({ session, token }) {
			// log.debug('in session, token, session>>>', token, session);
			session.roles = token.roles;
			if (session.user) session.user.id ??= token.sub;
			// log.debug('in session, session>>>>', session);
			return session;
		}
	}
	// // setup cross-subdomain sessionToken
	// cookies: {
	// 	sessionToken: {
	// 		name: cookieName,
	// 		options: {
	// 			httpOnly: true,
	// 			sameSite: 'lax',
	// 			path: '/',
	// 			domain: domain == 'localhost' ? domain : '.' + domain,
	// 			secure: useSecureCookie // process.env.NODE_ENV === 'production'
	// 		}
	// 	}
	// }
};
export const { handle, signIn, signOut } = SvelteKitAuth(authHookConfig);
