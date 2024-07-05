import { Logger } from '@spectacular/utils';
import type { Handle } from '@sveltejs/kit';

const log = new Logger('server:middleware:refreshToken');

export const refreshToken: Handle = async ({ event, resolve }) => {
  // TODO: extract refreshToken login from auth hook
  //  https://github.com/Critteros/JavaFlavors/blob/main/web/src/lib/server/hooks/tokenRefresh.ts
  const response = await resolve(event);
  return response;
};
