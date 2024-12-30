import { env as secrets } from '$env/dynamic/private';
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
    const claims = nhost.auth.getHasuraClaims();
    log.debug(lang, textDirection);
    // pass locale information from "server-context" to "shared server + client context"
    return {
      vercelEnv: secrets.VERCEL_ENV ?? 'development',
      userId: claims?.['x-hasura-user-id'],
      orgId: claims?.['x-hasura-default-org'],
      defaultOrg: claims?.['x-hasura-default-org'],
      defaultRole: claims?.['x-hasura-default-role'],
    };
  },
);
