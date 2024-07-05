import { load_GetUser } from '$houdini';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad, GetUserVariables as Variables } from './$houdini';

const log = new Logger('user.profile.browser');

// export const _GetUserVariables: Variables = async (event) => {
// const { user } = nhost;
// const userId = get(user)?.id;
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
  const { session } = await event.parent();
  const userId = session?.user.id;
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
