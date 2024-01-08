import { Logger } from '@spectacular/utils';
import { VERCEL_ENV } from '$env/static/private';

const log = new Logger('server:layout');

export const load = ({ locals: { lang, nhost } }) => {
	log.debug(lang);
	const session = nhost.auth.getSession();

	// pass locale information from "server-context" to "shared server + client context"
	return {
		vercelEnv: VERCEL_ENV,
		lang,
		user: session?.user
	};
};
