import { getNhostClient } from '$lib/stores/nhost';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { GetUserVariables as Variables } from './$houdini';

const log = new Logger('user.profile.browser');

export const _GetUserVariables: Variables = async (event) => {
  const { user } = getNhostClient();
  const userId = get(user)?.id;
  if (!userId) {
    log.error('not authenticated');
    throw error(400, 'not authenticated');
  }
  return { userId };
};
