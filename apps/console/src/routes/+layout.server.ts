import { Logger } from '@spectacular/utils';
import { VERCEL_ENV } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

const log = new Logger('server:layout');

export const load = (({ locals: { locale, LL, nhost } }) => {
	log.info(LL.log({ fileName: '+layout.server.ts' }));
	const session = nhost.auth.getSession();

	// pass locale information from "server-context" to "shared server + client context"
	return {
		vercelEnv: VERCEL_ENV,
		locale,
		user: session?.user
	};
}) satisfies LayoutServerLoad;
