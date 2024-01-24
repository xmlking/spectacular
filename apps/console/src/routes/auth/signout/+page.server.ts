import { Logger } from '@spectacular/utils';
import { redirect } from '@sveltejs/kit';
import { NHOST_SESSION_KEY } from '$lib/nhost';
import type { Actions } from './$types';

const log = new Logger('server:auth:signout');

export const actions = {
	default: async ({ cookies, locals: { lang, nhost } }) => {
		log.debug('signout', lang);

		await nhost.auth.signOut();
		cookies.set(NHOST_SESSION_KEY, '', { httpOnly: true, path: '/', maxAge: 0 });

		throw redirect(303, '/');
		// throw redirect(303, '/signin')
	}
} satisfies Actions;
