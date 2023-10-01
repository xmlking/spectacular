import { sveltinVersion, sveltekitVersion, buildTime } from '$config/defaults.js';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET = (async () => {
	return new Response(
		JSON.stringify({
			sveltinVersion,
			sveltekitVersion,
			buildTime
		})
	);
}) satisfies RequestHandler;
