import { flag } from 'flags/sveltekit';
import { env } from '$env/dynamic/private';

export const showMagicLinkLogin = flag<boolean>({
  key: 'showMagicLinkLogin',
  description: 'Whether this deployment should show passwordless login via Magic Link', // optional
  origin: 'https://example.com/#showMagicLinkLogin', // optional
  options: [{ value: true }, { value: false }], // optional
  // can be async and has access to the event
  decide(event) {
    // Very simple example to show how to use the URL to determine the flag.
    // In real live you would probably query an external source such as
    // Vercel Edge Config (https://vercel.com/docs/storage/edge-config)
    // return event.url.searchParams.has('svelteColor');
    return env.FEATURE_SHOW_MAGIC_LINK_LOGIN === 'true';
  },
});

export const showSocialLogin = flag<boolean>({
  key: 'showSocialLogin',
  description: 'Whether this deployment should show social login',
  origin: 'https://example.com/#showSocialLogin',
  options: [{ value: true }, { value: false }],
  decide(event) {
    return env.FEATURE_SHOW_SOCIAL_LOGIN === 'true';
  },
});

export const enableBotProtection = flag<boolean>({
  key: 'enableBotProtection',
  description: 'Enable Cloudflare Turnstile Bot Protection',
  origin: 'https://docs.nhost.io/guides/auth/bot-protection',
  options: [
    { value: true, label: 'on' },
    { value: false, label: 'off' },
  ],
  decide(event) {
    return env.FEATURE_SHOW_BOT_PROTECTION === 'true';
  },
});

export const simulateLoadingState = flag<boolean>({
  key: 'simulateLoadingState',
  description: 'Enable simulating loading states for testing',
  origin: 'https://example.com/#simulateLoadingState',
  options: [{ value: true }, { value: false }],
  decide(event) {
    return env.FEATURE_SIMULATE_LOADING_STATE === 'true';
  },
});
