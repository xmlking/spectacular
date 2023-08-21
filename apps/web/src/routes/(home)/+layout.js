// since there's no dynamic data for marketing site, we can prerender
// it so that it gets served as a static asset in prod
// FIXME: `$env/dynamic/public` not working with `prerender = true`
// https://github.com/sveltejs/kit/discussions/7700
import { dev } from '$app/environment';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
