import { load_GetUser } from '$houdini';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
// import { getNhostClient } from '$lib/stores/nhost';
import type { PageLoad, GetUserVariables as Variables } from './$houdini';

const log = new Logger('user.profile.browser');

export const _GetUserVariables: Variables = async (event) => {
  // const user = nhost.auth.getUser()
  // const userId = user?.id;
  const { userId, orgId, defaultRole } = await event.parent();
  if (!userId) {
    log.error('not authenticated');
    throw error(400, 'not authenticated');
  }
  return { userId };
};

/**
 * if you need more customizations
 */
// export const load: PageLoad = async (event) => {
//   const { session } = await event.parent();
//   const userId = session?.user.id;
//   if (!userId) {
//     log.error('not authenticated');
//     throw error(400, 'not authenticated');
//   }
//   // this load function will be rerun if manually invalidated elsewhere by calling `invalidate('app:profile')`.
//   // event.depends('app:profile');
//   return {
//     ...(await load_GetUser({
//       event,
//       variables: {
//         userId,
//       },
//       metadata: {
//         useRole: 'me',
//       },
//     })),
//   };
// };
