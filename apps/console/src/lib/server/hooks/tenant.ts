import { Logger } from '@repo/utils';
import type { Handle } from '@sveltejs/kit';
export const log = new Logger('server:middleware:detect-tenant');
/**
 * Note: not used
 * May be used in the future when subdomain based multitencny is implemented
 */
export const tenant = (async ({ event, resolve }) => {
  const tenant = event.request.headers.get('host')?.split('.')[0];
  // event.locals.defaultOrg = tenant;
  const result = await resolve(event);
  return result;
}) satisfies Handle;
