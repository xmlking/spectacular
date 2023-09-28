import type { RequestHandler } from './$types';
import { sveltinVersion, sveltekitVersion, buildTime } from '$config/defaults.js';

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
