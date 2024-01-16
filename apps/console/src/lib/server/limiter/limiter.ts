import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { RATE_LIMITER_KEY } from '$env/static/private';

export const limiter = new RateLimiter({
	// A rate is defined as [number, unit]
	rates: {
		IP: [10, 'h'], // IP address limiter
		IPUA: [5, 'm'], // IP + User Agent limiter
		cookie: {
			// Cookie limiter
			name: 'limiterid', // Unique cookie name for this limiter
			secret: RATE_LIMITER_KEY, // Use $env/static/private
			rate: [2, 'm'],
			preflight: true // Require preflight call (see load function)
		}
	}
});
