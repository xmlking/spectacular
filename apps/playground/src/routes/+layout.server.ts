import { VERCEL_ENV } from '$env/static/private';
import { Logger } from '@spectacular/utils';
import { loadFlash } from 'sveltekit-flash-message/server';

const log = new Logger('server:layout');

export const load = loadFlash(
  async ({
    locals: {
      paraglide: { lang, textDirection },
    },
  }) => {
    log.debug(lang, textDirection);

    // pass locale information from "server-context" to "shared server + client context"
    return {
      vercelEnv: VERCEL_ENV,
    };
  },
);
