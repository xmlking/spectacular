import { Logger } from '@spectacular/utils';
import { redirect } from '@sveltejs/kit';
import { NHOST_SESSION_KEY } from '$lib/nhost';
import { i18n } from '$lib/i18n';
import type { Actions } from './$types';

const log = new Logger('server:auth:signout');

export const actions = {
	default: async ({
		cookies,
		locals: {
			paraglide: { lang },
			nhost
		}
	}) => {
		log.debug('signout', lang);

		await nhost.auth.signOut();
		cookies.set(NHOST_SESSION_KEY, '', { httpOnly: true, path: '/', maxAge: 0 });

		throw redirect(303, i18n.resolveRoute('/'));
		// throw redirect(303, i18n.resolveRoute('/signin'));
	}
} satisfies Actions;
