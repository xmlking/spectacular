import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { env as secrets } from '$env/dynamic/private';

const CHALLENGE_URL = env.PUBLIC_CLOUDFLARE_TURNSTILE_CHALLENGE_URL!;
const SECRET = dev ? secrets.CLOUDFLARE_TURNSTILE_SECRET_KEY_ALWAYS_PASSES : secrets.CLOUDFLARE_TURNSTILE_SECRET_KEY;

interface TokenValidateResponse {
  'error-codes': string[];
  success: boolean;
  action: string;
  cdata: string;
}

export async function validateToken(token: string) {
  const response = await fetch(CHALLENGE_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      response: token,
      secret: SECRET,
    }),
  });

  const data: TokenValidateResponse = await response.json();

  return {
    // Return the status
    success: data.success,

    // Return the first error if it exists
    error: data['error-codes']?.length ? data['error-codes'][0] : null,
  };
}
