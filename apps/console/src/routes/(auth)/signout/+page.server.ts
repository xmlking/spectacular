import { Logger } from '@spectacular/utils';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { removeNhostSessionInCookies } from '$lib/nhost';
import { i18n } from '$lib/i18n';
import type { Actions } from './$types';

const log = new Logger('server:auth:signout');

export const actions = {
	default: async (event) => {
		const {
			cookies,
			locals: {
				paraglide: { lang },
				nhost
			}
		} = event;
		log.debug('signout', lang);

		await nhost.auth.signOut();
		removeNhostSessionInCookies(cookies);
		// cookies.set(NHOST_SESSION_KEY, '', { httpOnly: true, path: '/', maxAge: 0 });
		const message: App.Superforms.Message = { type: 'success', message: 'Signout sucessfull 😎' } as const;
		redirectWithFlash(303, i18n.resolveRoute('/'), message, event);
		// redirectWithFlash(303, i18n.resolveRoute('/signin'), message, event);
	}
} satisfies Actions;
