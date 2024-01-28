import { Logger } from '@spectacular/utils';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const log = new Logger('server:auth:logout');

export const actions = {
	default: async ({ locals: { LL } }) => {
		log.debug('in logout', LL.log({ fileName: 'api/+server.ts' }));

		throw redirect(303, '/');
		// throw redirect(303, '/sign-in')
	}
} satisfies Actions;
