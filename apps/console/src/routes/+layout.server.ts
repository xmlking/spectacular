import { Logger } from '@spectacular/utils';
import { loadFlash } from 'sveltekit-flash-message/server';
import { VERCEL_ENV } from '$env/static/private';

const log = new Logger('server:layout');

export const load = loadFlash(async ({ locals: { lang, nhost } }) => {
	log.debug(lang);
	const session = nhost.auth.getSession();

	// pass locale information from "server-context" to "shared server + client context"
	return {
		vercelEnv: VERCEL_ENV,
		lang,
		user: session?.user
	};
});
