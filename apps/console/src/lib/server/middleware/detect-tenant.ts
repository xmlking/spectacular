import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
export const log = new Logger('middleware:detect-tenant');

export const detectTenant = (async ({ event, resolve }) => {
	const tenant = event.request.headers.get('host')?.split('.')[0];
	event.locals.defaultOrg = tenant;
	const result = await resolve(event);
	return result;
}) satisfies Handle;
