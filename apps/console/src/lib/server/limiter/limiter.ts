import { RATE_LIMIT_SECRET } from '$env/static/private';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

export const limiter = new RetryAfterRateLimiter({
  // A rate is defined as [number, unit]
  rates: {
    IP: [10, 'h'], // IP address limiter, allowing up to  10 requests per hour
    IPUA: [5, 'm'], // IP + User Agent limiter, allowing up to  5 requests per minute
    cookie: {
      // Cookie limiter
      name: 'limiterid', // Unique cookie name for this limiter
      secret: RATE_LIMIT_SECRET, // Use $env/static/private
      rate: [2, 'm'], // Allows up to  2 requests per minute from the same browser session
      preflight: true, // Require preflight call (see load function)
    },
  },
});
