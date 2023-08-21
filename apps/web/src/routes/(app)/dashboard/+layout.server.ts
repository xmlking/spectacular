import { loadFlashMessage } from 'sveltekit-flash-message/server';

export const load = loadFlashMessage(async (event) => {
	return {
		session: await event.locals.getSession()
	};
});
