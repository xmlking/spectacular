import { VERCEL_ENV } from '$env/static/private';
import { Logger } from '@spectacular/utils';
import { loadFlash } from 'sveltekit-flash-message/server';

const log = new Logger('root:layout:server');

export const load = loadFlash(
  async ({
    locals: {
      paraglide: { lang, textDirection },
      nhost,
    },
  }) => {
    log.debug(lang, textDirection);
    const session = nhost.auth.getSession();

    // pass locale information from "server-context" to "shared server + client context"
    return {
      vercelEnv: VERCEL_ENV,
      session,
    };
  },
);
