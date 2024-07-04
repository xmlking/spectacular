import { load_GetUser } from '$houdini';
import { user } from '$lib/stores/user';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad, GetUserVariables as Variables } from './$houdini';

const log = new Logger('user.profile.browser');

// export const _GetUserVariables: Variables = async (event) => {
//   const userId = get(user)?.id;
//   if (!userId) {
//     log.error('not authenticated');
//     throw error(400, 'not authenticated');
//   }
//   return { userId };
// };

/**
 * TODO: is this going to be a blocking call?
 */
export const load: PageLoad = async (event) => {
  const userId = get(user)?.id;
  if (!userId) {
    log.error('not authenticated');
    throw error(400, 'not authenticated');
  }
  return {
    ...(await load_GetUser({
      event,
      variables: {
        userId,
      },
      metadata: {
        useRole: 'me',
      },
    })),
  };
};
