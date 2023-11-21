import type { OAuthConfig, OAuthUserConfig } from '@auth/core/providers';

export interface PingProfile extends Record<string, any> {
	sub: string;
	aud: string;
	jti: string;
	iss: string;
	iat: number;
	exp: number;
	acr: string;
	auth_time: number;
	groups: string[];
	displayName: string;
	email: string;
	username: string;
	'pi.sri': string;
}

export default function Ping<P extends PingProfile>(options: OAuthUserConfig<P> & { issuer: string; acr_values: string }): OAuthConfig<P> {
	const { acr_values, ...rest } = options;
	return {
		id: 'ping',
		name: 'Ping ID',
		type: 'oidc',
		authorization: {
			params: { scope: 'profile openid email address phone', acr_values, ...rest.authorization?.params }
		},
		profile(profile: PingProfile) {
			return {
				id: profile.sub,
				name: profile.displayName,
				email: profile.email,
				image: null
			};
		},
		client: {
			token_endpoint_auth_method: 'none',
			id_token_signed_response_alg: 'ES256'
		},
		style: {
			logo: '/okta.svg',
			logoDark: '/okta-dark.svg',
			bg: '#fff',
			text: '#000',
			bgDark: '#000',
			textDark: '#fff'
		},
		options: rest
	};
}
