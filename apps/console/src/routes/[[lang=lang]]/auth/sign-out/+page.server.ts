import { Logger } from '@spectacular/utils';
import { redirect } from '@sveltejs/kit';
import { getNhost, NHOST_SESSION_KEY } from '$lib/nhost';
import type { Actions } from './$types';

const log = new Logger('server:auth:logout');

export const actions = {
	default: async ({ cookies, locals: { LL } }) => {
		const nhost = await getNhost(cookies);
		log.debug('in logout', LL.log({ fileName: 'api/+server.ts' }));

		await nhost.auth.signOut();
		cookies.set(NHOST_SESSION_KEY, '', { httpOnly: true, path: '/', maxAge: 0 });

		throw redirect(303, '/');
		// throw redirect(303, '/sign-in')
	}
} satisfies Actions;
