import { flag } from '@vercel/flags/sveltekit';

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
    return true;
  },
});

export const showSocialLogin = flag<boolean>({
  key: 'showSocialLogin',
  description: 'Whether this deployment should show social login',
  origin: 'https://example.com/#showSocialLogin',
  options: [{ value: true }, { value: false }],
  decide(event) {
    return true;
  },
});
