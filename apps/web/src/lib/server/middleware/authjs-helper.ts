import { decode } from '@auth/core/jwt';
import type { Cookies } from '@sveltejs/kit';
import { SignJWT } from 'jose';
import envPri from '$lib/variables/variables.server';

// FIXME: temp workaround. remove when fixed.
// https://github.com/nextauthjs/next-auth/discussions/5595#discussioncomment-4628977

export const useSecureCookie = envPri.NEXTAUTH_URL?.startsWith('https://') ?? envPri.VERCEL;
export const domain = new URL(envPri.NEXTAUTH_URL).hostname.replace(/^[^.]+\./g, '');
export const cookieName = useSecureCookie ? '__Secure-authjs.session-token' : 'authjs.session-token';
const secret = new TextEncoder().encode(envPri.AUTH_SECRET);
const alg = 'HS256';

export async function getToken(cookies: Cookies, raw = false) {
	const token = cookies.get(cookieName);
	if (raw) return token;
	return await decode({ salt: cookieName, secret: envPri.AUTH_SECRET, token });
}

export async function getSignedToken(cookies: Cookies) {
	const decodedToken = await getToken(cookies);
	if (decodedToken == null || typeof decodedToken === 'string') return null;
	const signedToken = new SignJWT(decodedToken)
		// .setExpirationTime('1d')
		// .setIssuedAt()
		.setProtectedHeader({ alg })
		.sign(secret);
	return signedToken;
}
