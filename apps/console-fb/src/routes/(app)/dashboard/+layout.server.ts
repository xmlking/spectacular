export const prerender = false;

import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
    return {
        session: await event.locals.auth(),
    };
});
