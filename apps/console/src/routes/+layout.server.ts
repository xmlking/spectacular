import { env as secrets } from '$env/dynamic/private';
import { Logger } from '@spectacular/utils';
import { loadFlash } from 'sveltekit-flash-message/server';

const log = new Logger('root:layout:server');

export const load = loadFlash(
  async ({
    locals: {
      paraglide: { lang, textDirection },
    },
  }) => {
    log.debug(lang, textDirection);

    // pass locale information from "server-context" to "shared server + client context"
    return {
      vercelEnv: secrets.VERCEL_ENV ?? 'development',
    };
  },
);
