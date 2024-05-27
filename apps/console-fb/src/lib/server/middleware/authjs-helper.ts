import { decode } from '@auth/core/jwt';
import type { Cookies } from '@sveltejs/kit';
import { SignJWT } from 'jose';
import envPri from '$lib/variables/variables.server';
import envPub from '$lib/variables/variables';

// FIXME: temp workaround. remove when fixed.
// https://github.com/nextauthjs/next-auth/discussions/5595#discussioncomment-4628977

export const useSecureCookie = envPub.PUBLIC_BASE_URL?.startsWith('https://') ?? envPri.VERCEL;
export const domain = new URL(envPub.PUBLIC_BASE_URL).hostname.replace(/^[^.]+\./g, '');
export const cookieName = useSecureCookie ? '__Secure-authjs.session-token' : 'authjs.session-token';
const secret = new TextEncoder().encode(envPri.HASURA_GRAPHQL_JWT_SECRET_KEY);
const alg = 'HS256';

export async function getToken(cookies: Cookies, raw = false) {
    const token = cookies.get(cookieName);
    if (raw) return token;
    return await decode({ salt: cookieName, secret: envPri.HASURA_GRAPHQL_JWT_SECRET_KEY, token });
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
