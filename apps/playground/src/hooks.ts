import { i18n } from '$lib/i18n';
// export { dead_links as reroute } from "$lib/middleware/dead-links";
import type { Reroute } from '@sveltejs/kit';

export const reroute = i18n.reroute() satisfies Reroute;
