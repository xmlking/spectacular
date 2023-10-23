import { VERCEL_ENV } from '$env/static/private';
import { Logger } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

const log = new Logger('server:layout');

export const load = (({ locals: { locale, LL } }) => {
	log.info(LL.log({ fileName: '+layout.server.ts' }));

	// pass locale information from "server-context" to "shared server + client context"
	return {
		vercelEnv: VERCEL_ENV,
		locale
	};
}) satisfies LayoutServerLoad;
